package com.example.proyecto.app.repository;

import com.example.proyecto.app.model.Habitacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HabitacionRepository extends JpaRepository<Habitacion, Integer> {
    List<Habitacion> findByTipoIdTipoAndEstado(Integer idTipo, String estado);
}