package com.example.proyecto.app.controller;

import com.example.proyecto.app.model.TipoHabitacion;
import com.example.proyecto.app.service.TipoHabitacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tipos-habitacion")
@CrossOrigin(origins = "*")
public class TipoHabitacionController {
    @Autowired
    private TipoHabitacionService service;

    @GetMapping
    public ResponseEntity<List<TipoHabitacion>> listar() {
        return new ResponseEntity<>(service.listarTodos(), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<TipoHabitacion> obtener(@PathVariable Integer id) {
        return service.obtenerPorId(id)
                .map(t -> new ResponseEntity<>(t, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @PostMapping
    public ResponseEntity<TipoHabitacion> crear(@RequestBody TipoHabitacion tipo) {
        return new ResponseEntity<>(service.guardar(tipo), HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<TipoHabitacion> actualizar(@PathVariable Integer id, @RequestBody TipoHabitacion tipo) {
        if (!service.existePorId(id)) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        tipo.setIdTipo(id);
        return new ResponseEntity<>(service.guardar(tipo), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (!service.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }
        try {
            service.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }
}