package com.example.proyecto.app.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.proyecto.app.model.Reserva;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
}