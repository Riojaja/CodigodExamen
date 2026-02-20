package com.example.proyecto.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.proyecto.app.model.TipoHabitacion;

@Repository
public interface TipoHabitacionRepository extends JpaRepository<TipoHabitacion, Integer> {
    // Al extender JpaRepository, ya tienes: save(), findAll(), findById(), deleteById()
}