package com.example.proyecto.app.service;

import com.example.proyecto.app.model.Habitacion;
import com.example.proyecto.app.model.Reserva;
import com.example.proyecto.app.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReservaService {
    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private HabitacionService habitacionService;

    public List<Reserva> listarTodos() {
        return reservaRepository.findAll();
    }

    public Optional<Reserva> obtenerPorId(Integer id) {
        // Usar el método que carga las relaciones
        return reservaRepository.findByIdWithDetails(id);
    }

    public Reserva guardar(Reserva reserva) {
        // Calcular noches
        if (reserva.getFechaInicio() != null && reserva.getFechaFin() != null) {
            long noches = ChronoUnit.DAYS.between(reserva.getFechaInicio(), reserva.getFechaFin());
            reserva.setNoches((int) noches);
        }
        // Obtener precio de la habitación
        if (reserva.getHabitacion() != null && reserva.getHabitacion().getIdHabitacion() != null) {
            Optional<Habitacion> habitacionOpt = habitacionService.obtenerPorId(reserva.getHabitacion().getIdHabitacion());
            if (habitacionOpt.isPresent()) {
                Habitacion habitacion = habitacionOpt.get();
                BigDecimal precio = habitacion.getTipo().getPrecioNoche();
                reserva.setPrecioNoche(precio);
                if (reserva.getNoches() != null) {
                    reserva.setTotal(precio.multiply(BigDecimal.valueOf(reserva.getNoches())));
                }
            }
        }
        return reservaRepository.save(reserva);
    }

    public void eliminar(Integer id) {
        reservaRepository.deleteById(id);
    }

    public boolean existePorId(Integer id) {
        return reservaRepository.existsById(id);
    }

    public boolean isHabitacionDisponible(Integer idHabitacion, LocalDate fechaInicio, LocalDate fechaFin, Integer idReservaExcluir) {
        List<Reserva> reservas = reservaRepository.findReservasSolapadas(idHabitacion, fechaInicio, fechaFin, idReservaExcluir);
        return reservas.isEmpty();
    }
}