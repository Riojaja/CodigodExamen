package com.example.proyecto.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.proyecto.app.model.TipoHabitacion;
import com.example.proyecto.app.service.TipoHabitacionService;

import java.util.List;

@RestController
@RequestMapping("/api/tipos")
@CrossOrigin(origins = "http://localhost:4200")
public class TipoHabitacionController {

    @Autowired
    private TipoHabitacionService service;

    @GetMapping
    public List<TipoHabitacion> listar() {
        return service.listarTodos();
    }

    @PostMapping
    public TipoHabitacion guardar(@RequestBody TipoHabitacion tipo) {
        return service.guardar(tipo);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}