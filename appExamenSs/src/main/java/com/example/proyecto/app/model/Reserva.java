package com.example.proyecto.app.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "reserva")
public class Reserva {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_reserva")
	private Integer idReserva;

	@ManyToOne
	@JoinColumn(name = "id_huesped")
	private Huesped huesped;

	@ManyToOne
	@JoinColumn(name = "id_habitacion")
	private Habitacion habitacion;

	@Column(name = "fecha_inicio")
	private LocalDate fechaInicio;

	@Column(name = "fecha_fin")
	private LocalDate fechaFin;

	private Integer noches;

	@Column(name = "precio_noche")
	private BigDecimal precioNoche;

	private BigDecimal total;

	/**
	 * CRITERIO: Cálculo automático (backend) - 3 pts Este método se ejecuta
	 * automáticamente antes de insertar o actualizar.
	 */
	@PrePersist
	@PreUpdate
	public void calcularValores() {
		if (fechaInicio != null && fechaFin != null && habitacion != null) {
			// Calcular diferencia de días (noches)
			long dias = ChronoUnit.DAYS.between(fechaInicio, fechaFin);
			this.noches = (int) (dias <= 0 ? 1 : dias); // Mínimo 1 noche

			// Obtener el precio del tipo de habitación asignado
			this.precioNoche = habitacion.getTipoHabitacion().getPrecioNoche();

			// Calcular el total: noches * precioNoche
			this.total = this.precioNoche.multiply(new BigDecimal(this.noches));
		}
	}

	// --- Getters y Setters ---
	public Integer getIdReserva() {
		return idReserva;
	}

	public void setIdReserva(Integer idReserva) {
		this.idReserva = idReserva;
	}

	public Huesped getHuesped() {
		return huesped;
	}

	public void setHuesped(Huesped huesped) {
		this.huesped = huesped;
	}

	public Habitacion getHabitacion() {
		return habitacion;
	}

	public void setHabitacion(Habitacion habitacion) {
		this.habitacion = habitacion;
	}

	public LocalDate getFechaInicio() {
		return fechaInicio;
	}

	public void setFechaInicio(LocalDate fechaInicio) {
		this.fechaInicio = fechaInicio;
	}

	public LocalDate getFechaFin() {
		return fechaFin;
	}

	public void setFechaFin(LocalDate fechaFin) {
		this.fechaFin = fechaFin;
	}

	public Integer getNoches() {
		return noches;
	}

	public void setNoches(Integer noches) {
		this.noches = noches;
	}

	public BigDecimal getPrecioNoche() {
		return precioNoche;
	}

	public void setPrecioNoche(BigDecimal precioNoche) {
		this.precioNoche = precioNoche;
	}

	public BigDecimal getTotal() {
		return total;
	}

	public void setTotal(BigDecimal total) {
		this.total = total;
	}
}