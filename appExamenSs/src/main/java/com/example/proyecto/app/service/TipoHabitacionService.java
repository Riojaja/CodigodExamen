package com.example.proyecto.app.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.proyecto.app.model.TipoHabitacion;
import com.example.proyecto.app.repository.TipoHabitacionRepository;

import java.util.List;

@Service
public class TipoHabitacionService {

    @Autowired
    private TipoHabitacionRepository repository;

    public List<TipoHabitacion> listarTodos() {
        return repository.findAll();
    }

    public TipoHabitacion guardar(TipoHabitacion tipo) {
        return repository.save(tipo);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }

    public TipoHabitacion buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }
}
