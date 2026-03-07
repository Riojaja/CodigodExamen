package com.example.proyecto.app.controller;


import com.example.proyecto.app.model.Habitacion;
import com.example.proyecto.app.service.HabitacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/habitaciones")
@CrossOrigin(origins = "*")
public class HabitacionController {
    @Autowired
    private HabitacionService service;

    @GetMapping
    public ResponseEntity<List<Habitacion>> listar() {
        return new ResponseEntity<>(service.listarTodos(), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Habitacion> obtener(@PathVariable Integer id) {
        return service.obtenerPorId(id)
                .map(h -> new ResponseEntity<>(h, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @GetMapping("/disponibles-por-tipo")
    public ResponseEntity<List<Habitacion>> disponiblesPorTipo(@RequestParam Integer idTipo) {
        return new ResponseEntity<>(service.buscarDisponiblesPorTipo(idTipo), HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<Habitacion> crear(@RequestBody Habitacion habitacion) {
        return new ResponseEntity<>(service.guardar(habitacion), HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Habitacion> actualizar(@PathVariable Integer id, @RequestBody Habitacion habitacion) {
        if (!service.existePorId(id)) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        habitacion.setIdHabitacion(id);
        return new ResponseEntity<>(service.guardar(habitacion), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (!service.existePorId(id)) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        service.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
