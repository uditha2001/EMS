package com.example.examManagementBackend.configurations;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileStorageInitializer {

    private static final Logger logger = LoggerFactory.getLogger(FileStorageInitializer.class);

    @Value("${file.upload.archived-dir}")
    private String archivedDir;

    @Value("${file.upload.profile-dir}")
    private String profileImagesDir;

    @Value("${file.upload.encrypted-dir}")
    private String encryptedDir;

    @PostConstruct
    public void init() {
        try {
            createDirectoryIfNotExists(archivedDir);
            createDirectoryIfNotExists(profileImagesDir);
            createDirectoryIfNotExists(encryptedDir);
        } catch (IOException e) {
            logger.error("Error initializing file storage directories", e);
        }
    }

    private void createDirectoryIfNotExists(String pathStr) throws IOException {
        if (pathStr == null || pathStr.trim().isEmpty()) {
            logger.warn("Directory path is empty or null.");
            return;
        }

        Path path = Paths.get(pathStr.trim());
        if (!Files.exists(path)) {
            Files.createDirectories(path);
            logger.info("Created directory: {}", path.toAbsolutePath());
        } else {
            logger.info("Directory already exists: {}", path.toAbsolutePath());
        }
    }
}
