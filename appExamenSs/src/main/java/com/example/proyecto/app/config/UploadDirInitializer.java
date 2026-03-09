package com.example.proyecto.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class UploadDirInitializer {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        try {
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                System.out.println("Directorio de uploads creado: " + path.toAbsolutePath());
            }
        } catch (Exception e) {
            throw new RuntimeException("No se pudo crear el directorio de uploads", e);
        }
    }
}