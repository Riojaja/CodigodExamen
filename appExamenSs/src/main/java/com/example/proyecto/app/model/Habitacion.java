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
	private String estado;

	@ManyToOne
	@JoinColumn(name = "id_tipo")
	private TipoHabitacion tipoHabitacion;

	// --- Getters y Setters ---
	public Integer getIdHabitacion() {
		return idHabitacion;
	}

	public void setIdHabitacion(Integer idHabitacion) {
		this.idHabitacion = idHabitacion;
	}

	public String getNumero() {
		return numero;
	}

	public void setNumero(String numero) {
		this.numero = numero;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	public TipoHabitacion getTipoHabitacion() {
		return tipoHabitacion;
	}

	public void setTipoHabitacion(TipoHabitacion tipoHabitacion) {
		this.tipoHabitacion = tipoHabitacion;
	}
}
