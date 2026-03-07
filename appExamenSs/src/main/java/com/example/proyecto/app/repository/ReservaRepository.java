package com.example.proyecto.app.repository;

import com.example.proyecto.app.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
}