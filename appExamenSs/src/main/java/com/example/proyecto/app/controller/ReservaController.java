package com.example.proyecto.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.proyecto.app.model.Reserva;
import com.example.proyecto.app.service.ReservaService;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "http://localhost:4200")
public class ReservaController {

    @Autowired
    private ReservaService service;

    @GetMapping
    public List<Reserva> listar() {
        return service.listarTodas();
    }

    @PostMapping
    public Reserva guardar(@RequestBody Reserva reserva) {
        // Al guardar, el modelo ejecutará automáticamente el cálculo de noches y total
        return service.guardar(reserva);
    }

    @PutMapping("/{id}")
    public Reserva editar(@PathVariable Integer id, @RequestBody Reserva reserva) {
        reserva.setIdReserva(id);
        return service.guardar(reserva);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}