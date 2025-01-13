package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class EncryptionService {

    @Autowired
    private UserManagementRepo userEntityRepository;

    private static final String RSA_ALGORITHM = "RSA";
    private static final String AES_ALGORITHM = "AES";
    private static final int RSA_KEY_SIZE = 2048;
    private static final int AES_KEY_SIZE = 256;

    private final Map<Long, KeyPair> userKeyPairs = new HashMap<>();

    public void generateKeyPairForUser(Long userId) throws NoSuchAlgorithmException {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(RSA_ALGORITHM);
        keyPairGenerator.initialize(RSA_KEY_SIZE);
        KeyPair keyPair = keyPairGenerator.generateKeyPair();

        // Base64 encode the keys
        String publicKey = Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded());
        String privateKey = Base64.getEncoder().encodeToString(keyPair.getPrivate().getEncoded());

        // Retrieve the user entity and save the keys
        UserEntity userEntity = userEntityRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        userEntity.setPublicKey(publicKey);
        userEntity.setPrivateKey(privateKey);
        userEntityRepository.save(userEntity);

        // Also store in memory for fast access
        userKeyPairs.put(userId, keyPair);
    }

    public void ensureKeyPairExists(Long userId) throws NoSuchAlgorithmException {
        if (!userKeyPairs.containsKey(userId)) {
            generateKeyPairForUser(userId);
        }
    }

    public KeyPair getKeyPairForUser(Long userId) throws NoSuchAlgorithmException {
        // Fetch the user entity and load the key pair from the database if not in memory
        if (!userKeyPairs.containsKey(userId)) {
            UserEntity userEntity = userEntityRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            byte[] publicKeyBytes = Base64.getDecoder().decode(userEntity.getPublicKey());
            byte[] privateKeyBytes = Base64.getDecoder().decode(userEntity.getPrivateKey());

            try {
                PublicKey publicKey = KeyFactory.getInstance(RSA_ALGORITHM).generatePublic(new X509EncodedKeySpec(publicKeyBytes));
                PrivateKey privateKey = KeyFactory.getInstance(RSA_ALGORITHM).generatePrivate(new PKCS8EncodedKeySpec(privateKeyBytes));
                KeyPair keyPair = new KeyPair(publicKey, privateKey);
                userKeyPairs.put(userId, keyPair); // Cache the key pair
                return keyPair;
            } catch (Exception e) {
                throw new RuntimeException("Failed to load keys", e);
            }
        }
        return userKeyPairs.get(userId);
    }

    public String encrypt(Long userId, byte[] data) throws Exception {
        ensureKeyPairExists(userId);
        KeyPair keyPair = userKeyPairs.get(userId);

        // Generate AES key and IV
        KeyGenerator keyGen = KeyGenerator.getInstance(AES_ALGORITHM);
        keyGen.init(AES_KEY_SIZE);
        SecretKey aesKey = keyGen.generateKey();
        byte[] iv = new byte[16]; // 16 bytes for AES
        new SecureRandom().nextBytes(iv);
        IvParameterSpec ivSpec = new IvParameterSpec(iv);

        // Encrypt AES key with RSA
        Cipher rsaCipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
        rsaCipher.init(Cipher.ENCRYPT_MODE, keyPair.getPublic());
        byte[] encryptedAesKey = rsaCipher.doFinal(aesKey.getEncoded());

        // Encrypt data with AES
        Cipher aesCipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        aesCipher.init(Cipher.ENCRYPT_MODE, aesKey, ivSpec);
        byte[] encryptedData = aesCipher.doFinal(data);

        // Combine IV, encrypted AES key, and encrypted data
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        outputStream.write(iv); // Add IV at the beginning
        outputStream.write(encryptedAesKey); // Add encrypted AES key
        outputStream.write(encryptedData); // Add encrypted data

        return Base64.getEncoder().encodeToString(outputStream.toByteArray());
    }

    public byte[] decrypt(Long userId, byte[] encryptedData) throws Exception {
        ensureKeyPairExists(userId);
        KeyPair keyPair = userKeyPairs.get(userId);

        byte[] decodedData = Base64.getDecoder().decode(encryptedData);

        // Extract IV, encrypted AES key, and encrypted file data
        byte[] iv = Arrays.copyOfRange(decodedData, 0, 16);
        byte[] encryptedAesKey = Arrays.copyOfRange(decodedData, 16, 16 + RSA_KEY_SIZE / 8);
        byte[] encryptedFileData = Arrays.copyOfRange(decodedData, 16 + RSA_KEY_SIZE / 8, decodedData.length);

        // Decrypt AES key with RSA
        Cipher rsaCipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
        rsaCipher.init(Cipher.DECRYPT_MODE, keyPair.getPrivate());
        byte[] aesKeyBytes = rsaCipher.doFinal(encryptedAesKey);

        SecretKey aesKey = new SecretKeySpec(aesKeyBytes, AES_ALGORITHM);
        IvParameterSpec ivSpec = new IvParameterSpec(iv);

        // Decrypt data with AES
        Cipher aesCipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        aesCipher.init(Cipher.DECRYPT_MODE, aesKey, ivSpec);
        return aesCipher.doFinal(encryptedFileData);
    }

    public String getPublicKeyForUser(Long userId) {
        try {
            ensureKeyPairExists(userId);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        return Base64.getEncoder().encodeToString(userKeyPairs.get(userId).getPublic().getEncoded());
    }
}

