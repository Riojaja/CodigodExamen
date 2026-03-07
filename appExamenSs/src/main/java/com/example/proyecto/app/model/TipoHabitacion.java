package com.example.proyecto.app.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "tipo_habitacion")
public class TipoHabitacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo")
    private Integer idTipo;
    private String nombre;
    private String descripcion;
    @Column(name = "precio_noche", precision = 10, scale = 2)
    private BigDecimal precioNoche;

    public TipoHabitacion() {}
    // Getters y setters (generar con IDE o manualmente)
    public Integer getIdTipo() { return idTipo; }
    public void setIdTipo(Integer idTipo) { this.idTipo = idTipo; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public BigDecimal getPrecioNoche() { return precioNoche; }
    public void setPrecioNoche(BigDecimal precioNoche) { this.precioNoche = precioNoche; }
}