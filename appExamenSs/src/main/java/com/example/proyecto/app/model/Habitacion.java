package com.example.proyecto.app.model;

import jakarta.persistence.*;

@Entity
@Table(name = "habitacion")
public class Habitacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_habitacion")
    private Integer idHabitacion;
    private String numero;
    @ManyToOne
    @JoinColumn(name = "id_tipo")
    private TipoHabitacion tipo;
    private String estado;
    @Column(name = "imagen_url")
    private String imagenUrl;

    public Habitacion() {}
    // Getters y setters
    public Integer getIdHabitacion() { return idHabitacion; }
    public void setIdHabitacion(Integer idHabitacion) { this.idHabitacion = idHabitacion; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public TipoHabitacion getTipo() { return tipo; }
    public void setTipo(TipoHabitacion tipo) { this.tipo = tipo; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
}