package com.example.proyecto.app.repository;

import com.example.proyecto.app.model.Huesped;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HuespedRepository extends JpaRepository<Huesped, Integer> {
}