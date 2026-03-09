package com.example.proyecto.app.controller;

import com.example.proyecto.app.model.Reserva;
import com.example.proyecto.app.service.ReservaService;
import com.example.proyecto.app.util.PdfGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {

    @Autowired
    private ReservaService service;

    // Listar todas las reservas
    @GetMapping
    public ResponseEntity<List<Reserva>> listar() {
        List<Reserva> reservas = service.listarTodos();
        return new ResponseEntity<>(reservas, HttpStatus.OK);
    }

    // Obtener una reserva por ID
    @GetMapping("/{id}")
    public ResponseEntity<Reserva> obtener(@PathVariable Integer id) {
        return service.obtenerPorId(id)
                .map(reserva -> new ResponseEntity<>(reserva, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Crear una nueva reserva
    @PostMapping
    public ResponseEntity<Reserva> crear(@RequestBody Reserva reserva) {
        Reserva nueva = service.guardar(reserva);
        return new ResponseEntity<>(nueva, HttpStatus.CREATED);
    }

    // Actualizar una reserva existente
    @PutMapping("/{id}")
    public ResponseEntity<Reserva> actualizar(@PathVariable Integer id, @RequestBody Reserva reserva) {
        if (!service.existePorId(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        reserva.setIdReserva(id);
        Reserva actualizada = service.guardar(reserva);
        return new ResponseEntity<>(actualizada, HttpStatus.OK);
    }

    // Eliminar una reserva
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (!service.existePorId(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        service.eliminar(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Generar comprobante PDF de una reserva
    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> generarPdf(@PathVariable Integer id) {
        return service.obtenerPorId(id)
                .map(reserva -> {
                    try {
                        byte[] pdf = PdfGenerator.generarComprobante(reserva);
                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_PDF);
                        headers.setContentDispositionFormData("filename", "reserva_" + id + ".pdf");
                        return ResponseEntity.ok()
                                .headers(headers)
                                .body(pdf); // Retorna ResponseEntity<byte[]>
                    } catch (Exception e) {
                        e.printStackTrace();
                        // Retorna ResponseEntity<byte[]> con cuerpo null y status 500
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .<byte[]>body(null);
                    }
                })
                .orElse(ResponseEntity.notFound().<byte[]>build()); // Retorna ResponseEntity<byte[]> con status 404
    }
    
    @GetMapping("/disponibilidad")
    public ResponseEntity<Boolean> verificarDisponibilidad(
            @RequestParam Integer idHabitacion,
            @RequestParam String fechaInicio,
            @RequestParam String fechaFin,
            @RequestParam(required = false) Integer idReserva) {
        LocalDate inicio = LocalDate.parse(fechaInicio);
        LocalDate fin = LocalDate.parse(fechaFin);
        boolean disponible = service.isHabitacionDisponible(idHabitacion, inicio, fin, idReserva);
        return ResponseEntity.ok(disponible);
    }
    
    
    
}