package com.example.proyecto.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.proyecto.app.model.Reserva;
import com.example.proyecto.app.model.Habitacion;
import com.example.proyecto.app.repository.ReservaRepository;
import com.example.proyecto.app.repository.HabitacionRepository;

import java.util.List;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepo;

    @Autowired
    private HabitacionRepository habitacionRepo; // Necesario para buscar el precio

    public List<Reserva> listarTodas() {
        return reservaRepo.findAll();
    }

    public Reserva guardar(Reserva reserva) {
        // SOLUCIÓN AL ERROR 500:
        // Buscamos la habitación real en la BD usando el ID que envió Angular.
        // Esto carga el TipoHabitacion y el PrecioNoche.
        if (reserva.getHabitacion() != null && reserva.getHabitacion().getIdHabitacion() != null) {
            Habitacion habCompleta = habitacionRepo.findById(reserva.getHabitacion().getIdHabitacion())
                .orElseThrow(() -> new RuntimeException("Habitación no encontrada"));
            
            // Asignamos la habitación completa a la reserva
            reserva.setHabitacion(habCompleta);
        }

        // Ahora, al llamar a save(), el método calcularValores() de la entidad 
        // tendrá éxito porque 'habitacion.getTipoHabitacion()' ya no será null.
        return reservaRepo.save(reserva);
    }

    public void eliminar(Integer id) {
        reservaRepo.deleteById(id);
    }
}