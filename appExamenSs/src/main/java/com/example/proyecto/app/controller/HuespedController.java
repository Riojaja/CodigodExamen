package com.example.proyecto.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.proyecto.app.model.Huesped;
import com.example.proyecto.app.service.HuespedService;

import java.util.List;

@RestController
@RequestMapping("/api/huespedes")
@CrossOrigin(origins = "http://localhost:4200")
public class HuespedController {

    @Autowired
    private HuespedService service;

    @GetMapping
    public List<Huesped> listar() {
        return service.listarTodos();
    }

    @PostMapping
    public Huesped guardar(@RequestBody Huesped huesped) {
        return service.guardar(huesped);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }
}
