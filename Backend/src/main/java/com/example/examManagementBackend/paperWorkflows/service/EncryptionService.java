package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import jakarta.annotation.PostConstruct;
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
import java.util.*;

@Service
public class EncryptionService {

    @Autowired
    private UserManagementRepo userEntityRepository;

    private static final String RSA_ALGORITHM = "RSA";
    private static final String AES_ALGORITHM = "AES";
    private static final int RSA_KEY_SIZE = 2048;
    private static final int AES_KEY_SIZE = 256;

    private final Map<Long, KeyPair> userKeyPairs = new HashMap<>();

    // Generate a new key pair for the user if it doesn't already exist
    public void generateKeyPairForUser(Long userId) throws NoSuchAlgorithmException {
        UserEntity userEntity = userEntityRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userEntity.getPublicKey() != null && userEntity.getPrivateKey() != null) {
            return; // Keys already exist
        }

        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(RSA_ALGORITHM);
        keyPairGenerator.initialize(RSA_KEY_SIZE);
        KeyPair keyPair = keyPairGenerator.generateKeyPair();

        String publicKey = Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded());
        String privateKey = Base64.getEncoder().encodeToString(keyPair.getPrivate().getEncoded());

        userEntity.setPublicKey(publicKey);
        userEntity.setPrivateKey(privateKey);
        userEntityRepository.save(userEntity);

        userKeyPairs.put(userId, keyPair);
    }


    // Ensure that the user's key pair exists, if not, generate a new one
    public void ensureKeyPairExists(Long userId) throws NoSuchAlgorithmException {
        if (!userKeyPairs.containsKey(userId)) {
            generateKeyPairForUser(userId);
        }
    }

    // Retrieve the key pair for a user from cache or database
    public KeyPair getKeyPairForUser(Long userId) {
        if (!userKeyPairs.containsKey(userId)) {
            UserEntity userEntity = userEntityRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            try {
                byte[] publicKeyBytes = Base64.getDecoder().decode(userEntity.getPublicKey());
                byte[] privateKeyBytes = Base64.getDecoder().decode(userEntity.getPrivateKey());

                PublicKey publicKey = KeyFactory.getInstance(RSA_ALGORITHM).generatePublic(new X509EncodedKeySpec(publicKeyBytes));
                PrivateKey privateKey = KeyFactory.getInstance(RSA_ALGORITHM).generatePrivate(new PKCS8EncodedKeySpec(privateKeyBytes));
                KeyPair keyPair = new KeyPair(publicKey, privateKey);
                userKeyPairs.put(userId, keyPair); // Cache the key pair
                return keyPair;
            } catch (Exception e) {
                throw new RuntimeException("Failed to load keys from database", e);
            }
        }
        return userKeyPairs.get(userId);
    }

    // Retrieve the public key for a user
    public String getPublicKeyForUser(Long userId) {
        try {
            ensureKeyPairExists(userId);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Public key generation failed", e);
        }
        return Base64.getEncoder().encodeToString(userKeyPairs.get(userId).getPublic().getEncoded());
    }

    // Encrypt data for multiple users (creator and moderator)
    public String encryptForMultipleUsers(Long creatorId, Long moderatorId, byte[] data) throws Exception {
        ensureKeyPairExists(creatorId);
        ensureKeyPairExists(moderatorId);

        KeyPair creatorKeyPair = userKeyPairs.get(creatorId);
        KeyPair moderatorKeyPair = userKeyPairs.get(moderatorId);

        // Generate AES key and IV
        KeyGenerator keyGen = KeyGenerator.getInstance(AES_ALGORITHM);
        keyGen.init(AES_KEY_SIZE);
        SecretKey aesKey = keyGen.generateKey();
        byte[] iv = new byte[16];
        new SecureRandom().nextBytes(iv);
        IvParameterSpec ivSpec = new IvParameterSpec(iv);

        // Encrypt AES key with creator's and moderator's public key
        Cipher rsaCipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
        rsaCipher.init(Cipher.ENCRYPT_MODE, creatorKeyPair.getPublic());
        byte[] encryptedAesKeyForCreator = rsaCipher.doFinal(aesKey.getEncoded());

        rsaCipher.init(Cipher.ENCRYPT_MODE, moderatorKeyPair.getPublic());
        byte[] encryptedAesKeyForModerator = rsaCipher.doFinal(aesKey.getEncoded());

        // Encrypt data with AES
        Cipher aesCipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        aesCipher.init(Cipher.ENCRYPT_MODE, aesKey, ivSpec);
        byte[] encryptedData = aesCipher.doFinal(data);

        // Combine IV, encrypted AES keys, and encrypted data
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        outputStream.write(iv);
        outputStream.write(encryptedAesKeyForCreator); // Creator's encrypted AES key
        outputStream.write(encryptedAesKeyForModerator); // Moderator's encrypted AES key
        outputStream.write(encryptedData);

        return Base64.getEncoder().encodeToString(outputStream.toByteArray());
    }

    // Decrypt data for a specific user (creator or moderator)
    public byte[] decryptForUser(Long userId, byte[] encryptedData) throws Exception {
        ensureKeyPairExists(userId);
        KeyPair keyPair = userKeyPairs.get(userId);

        byte[] decodedData = Base64.getDecoder().decode(encryptedData);

        // Extract IV, encrypted AES keys, and encrypted file data
        byte[] iv = Arrays.copyOfRange(decodedData, 0, 16);
        byte[] encryptedAesKeyForCreator = Arrays.copyOfRange(decodedData, 16, 16 + RSA_KEY_SIZE / 8);
        byte[] encryptedAesKeyForModerator = Arrays.copyOfRange(decodedData, 16 + RSA_KEY_SIZE / 8, 16 + 2 * RSA_KEY_SIZE / 8);
        byte[] encryptedFileData = Arrays.copyOfRange(decodedData, 16 + 2 * RSA_KEY_SIZE / 8, decodedData.length);

        // Decrypt AES key with the user's private key (either creator or moderator)
        Cipher rsaCipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
        rsaCipher.init(Cipher.DECRYPT_MODE, keyPair.getPrivate());
        byte[] aesKeyBytes;
        try {
            aesKeyBytes = rsaCipher.doFinal(encryptedAesKeyForCreator); // Try creator's key
        } catch (Exception e) {
            aesKeyBytes = rsaCipher.doFinal(encryptedAesKeyForModerator); // Fallback to moderator's key
        }

        SecretKey aesKey = new SecretKeySpec(aesKeyBytes, AES_ALGORITHM);
        IvParameterSpec ivSpec = new IvParameterSpec(iv);

        // Decrypt data with AES
        Cipher aesCipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        aesCipher.init(Cipher.DECRYPT_MODE, aesKey, ivSpec);
        return aesCipher.doFinal(encryptedFileData);
    }


    @PostConstruct
    public void loadAllUserKeys() {
        userEntityRepository.findAll().forEach(userEntity -> {
            try {
                byte[] publicKeyBytes = Base64.getDecoder().decode(userEntity.getPublicKey());
                byte[] privateKeyBytes = Base64.getDecoder().decode(userEntity.getPrivateKey());
                PublicKey publicKey = KeyFactory.getInstance(RSA_ALGORITHM).generatePublic(new X509EncodedKeySpec(publicKeyBytes));
                PrivateKey privateKey = KeyFactory.getInstance(RSA_ALGORITHM).generatePrivate(new PKCS8EncodedKeySpec(privateKeyBytes));
                userKeyPairs.put(userEntity.getUserId(), new KeyPair(publicKey, privateKey));
            } catch (Exception e) {
                // Log and handle error
            }
        });
    }


}
