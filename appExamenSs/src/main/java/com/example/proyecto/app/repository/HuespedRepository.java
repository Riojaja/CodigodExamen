package com.example.proyecto.app.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.proyecto.app.model.Huesped;

@Repository
public interface HuespedRepository extends JpaRepository<Huesped, Integer> {
    // Útil si quieres buscar huéspedes por DNI en el futuro
    Huesped findByDni(String dni);
}
