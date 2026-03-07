package com.example.proyecto.app.dto;


public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private Integer id;
    private String username;
    private String role;

    public LoginResponse(String token, Integer id, String username, String role) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.role = role;
    }

    // Getters y Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
