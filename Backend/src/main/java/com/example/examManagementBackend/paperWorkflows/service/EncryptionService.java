package com.example.examManagementBackend.paperWorkflows.service;

import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.*;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class EncryptionService {

    private static final String RSA_ALGORITHM = "RSA";
    private static final String AES_ALGORITHM = "AES";
    private static final int RSA_KEY_SIZE = 2048;
    private static final int AES_KEY_SIZE = 256;

    private final Map<Long, KeyPair> userKeyPairs = new HashMap<>();

    public EncryptionService() {
        // Default constructor
    }

    public void generateKeyPairForUser(Long userId) throws NoSuchAlgorithmException {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(RSA_ALGORITHM);
        keyPairGenerator.initialize(RSA_KEY_SIZE);
        userKeyPairs.put(userId, keyPairGenerator.generateKeyPair());
    }

    public void ensureKeyPairExists(Long userId) throws NoSuchAlgorithmException {
        if (!userKeyPairs.containsKey(userId)) {
            generateKeyPairForUser(userId);
        }
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
