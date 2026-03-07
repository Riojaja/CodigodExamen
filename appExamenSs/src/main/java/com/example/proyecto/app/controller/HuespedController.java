package com.example.proyecto.app.controller;


import com.example.proyecto.app.model.Huesped;
import com.example.proyecto.app.service.HuespedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/huespedes")
@CrossOrigin(origins = "*")
public class HuespedController {
    @Autowired
    private HuespedService service;

    @GetMapping
    public ResponseEntity<List<Huesped>> listar() {
        return new ResponseEntity<>(service.listarTodos(), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Huesped> obtener(@PathVariable Integer id) {
        return service.obtenerPorId(id)
                .map(h -> new ResponseEntity<>(h, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @PostMapping
    public ResponseEntity<Huesped> crear(@RequestBody Huesped huesped) {
        return new ResponseEntity<>(service.guardar(huesped), HttpStatus.CREATED);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Huesped> actualizar(@PathVariable Integer id, @RequestBody Huesped huesped) {
        if (!service.existePorId(id)) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        huesped.setIdHuesped(id);
        return new ResponseEntity<>(service.guardar(huesped), HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (!service.existePorId(id)) return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        service.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}