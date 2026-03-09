package com.example.proyecto.app.repository;

import com.example.proyecto.app.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {

    @Query("SELECT r FROM Reserva r JOIN FETCH r.habitacion h JOIN FETCH h.tipo WHERE r.idReserva = :id")
    Optional<Reserva> findByIdWithDetails(@Param("id") Integer id);

    @Query("SELECT r FROM Reserva r WHERE r.habitacion.idHabitacion = :idHabitacion AND " +
           "((r.fechaInicio BETWEEN :fechaInicio AND :fechaFin) OR " +
           "(r.fechaFin BETWEEN :fechaInicio AND :fechaFin) OR " +
           "(:fechaInicio BETWEEN r.fechaInicio AND r.fechaFin)) AND " +
           "(:idReservaExcluir IS NULL OR r.idReserva != :idReservaExcluir)")
    List<Reserva> findReservasSolapadas(@Param("idHabitacion") Integer idHabitacion,
                                        @Param("fechaInicio") LocalDate fechaInicio,
                                        @Param("fechaFin") LocalDate fechaFin,
                                        @Param("idReservaExcluir") Integer idReservaExcluir);
}