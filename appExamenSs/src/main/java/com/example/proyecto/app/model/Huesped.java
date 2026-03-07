package com.example.proyecto.app.model;

import jakarta.persistence.*;

@Entity
@Table(name = "huesped")
public class Huesped {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_huesped")
    private Integer idHuesped;
    private String nombre;
    private String dni;
    private String telefono;
    private String email;

    public Huesped() {}
    // Getters y setters
    public Integer getIdHuesped() { return idHuesped; }
    public void setIdHuesped(Integer idHuesped) { this.idHuesped = idHuesped; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}