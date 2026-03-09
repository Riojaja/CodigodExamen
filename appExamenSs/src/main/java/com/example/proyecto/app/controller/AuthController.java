package com.example.proyecto.app.controller;

import com.example.proyecto.app.dto.LoginRequest;
import com.example.proyecto.app.dto.LoginResponse;
import com.example.proyecto.app.model.Usuario;
import com.example.proyecto.app.service.UsuarioService;
import com.example.proyecto.app.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Profile("jwt") 
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            Usuario usuario = usuarioService.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            // 🔹 Generar token incluyendo el rol del usuario
            String token = jwtUtil.generateToken(usuario.getUsername(), usuario.getRole());
            return ResponseEntity.ok(new LoginResponse(token, usuario.getId(), usuario.getUsername(), usuario.getRole()));
        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest().body("Error: Credenciales inválidas");
        }
    }
}