package com.example.proyecto.app.service;

import com.example.proyecto.app.model.Habitacion;
import com.example.proyecto.app.repository.HabitacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class HabitacionService {
    @Autowired
    private HabitacionRepository repository;

    public List<Habitacion> listarTodos() {
        return repository.findAll();
    }
    public Optional<Habitacion> obtenerPorId(Integer id) {
        return repository.findById(id);
    }
    public Habitacion guardar(Habitacion habitacion) {
        return repository.save(habitacion);
    }
    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
    public List<Habitacion> buscarDisponiblesPorTipo(Integer idTipo) {
        return repository.findByTipoIdTipoAndEstado(idTipo, "Disponible");
    }
    public boolean existePorId(Integer id) {
        return repository.existsById(id);
    }
}