package com.example.proyecto.app.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.proyecto.app.model.Habitacion;
import com.example.proyecto.app.repository.HabitacionRepository;

import java.util.List;

@Service
public class HabitacionService {

    @Autowired
    private HabitacionRepository repository;

    public List<Habitacion> listarTodas() {
        return repository.findAll();
    }

    public Habitacion guardar(Habitacion habitacion) {
        return repository.save(habitacion);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }

    public Habitacion buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }
}