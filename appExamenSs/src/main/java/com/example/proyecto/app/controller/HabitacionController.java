package com.example.proyecto.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.proyecto.app.model.Habitacion;
import com.example.proyecto.app.service.HabitacionService;

import java.util.List;

@RestController
@RequestMapping("/api/habitaciones")
@CrossOrigin(origins = "http://localhost:4200")
public class HabitacionController {

    @Autowired
    private HabitacionService service;

    @GetMapping
    public List<Habitacion> listar() {
        return service.listarTodas();
    }

    @PostMapping
    public Habitacion guardar(@RequestBody Habitacion habitacion) {
        return service.guardar(habitacion);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}