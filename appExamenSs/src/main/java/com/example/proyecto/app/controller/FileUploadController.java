package com.example.proyecto.app.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    private static final Logger log = LoggerFactory.getLogger(FileUploadController.class);

    // Directorio donde se guardarán las imágenes (se puede configurar en application.properties)
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    /**
     * Endpoint para subir una imagen.
     * Solo accesible para usuarios con rol ADMIN.
     *
     * @param file El archivo a subir (multipart/form-data)
     * @return ResponseEntity con la URL pública del archivo o mensaje de error
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("El archivo está vacío");
        }

        // Validar tipo de archivo (opcional, solo imágenes)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body("Solo se permiten archivos de imagen");
        }

        try {
            // Crear el directorio si no existe
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Generar nombre único para el archivo (para evitar colisiones)
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = Paths.get(uploadDir, filename);

            // Guardar el archivo
            Files.copy(file.getInputStream(), filePath);

            // Construir la URL pública para acceder al archivo
            String fileUrl = "/uploads/" + filename;
            log.info("Archivo guardado: {}, URL: {}", filePath, fileUrl);

            return ResponseEntity.ok(fileUrl);

        } catch (IOException e) {
            log.error("Error al guardar el archivo", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar el archivo");
        }
    }
}