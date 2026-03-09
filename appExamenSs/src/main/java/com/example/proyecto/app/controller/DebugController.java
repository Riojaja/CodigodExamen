package com.example.proyecto.app.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @GetMapping("/authorities")
    public Map<String, Object> getAuthorities(Principal principal) {
        if (principal instanceof JwtAuthenticationToken) {
            JwtAuthenticationToken token = (JwtAuthenticationToken) principal;
            return Map.of(
                "name", token.getName(),
                "authorities", token.getAuthorities().toString()
            );
        }
        return Map.of("error", "No JWT token");
    }
}