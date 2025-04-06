package com.example.examManagementBackend.configurations;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileStorageInitializer {

    @Value("${file.upload.archived-dir}")
    private String archivedDir;

    @Value("${file.upload.profile-dir}")
    private String profileImagesDir;

    @Value("${file.upload.encrypted-dir}")
    private String encryptedDir;

    @PostConstruct
    public void init() throws IOException {
        createDirectoryIfNotExists(archivedDir);
        createDirectoryIfNotExists(profileImagesDir);
        createDirectoryIfNotExists(encryptedDir);
    }

    private void createDirectoryIfNotExists(String pathStr) throws IOException {
        Path path = Paths.get(pathStr);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
            System.out.println("Created directory: " + path.toAbsolutePath());
        }
    }
}
