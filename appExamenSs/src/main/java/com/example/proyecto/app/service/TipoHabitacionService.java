package com.example.proyecto.app.service;

import com.example.proyecto.app.model.TipoHabitacion;
import com.example.proyecto.app.repository.TipoHabitacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TipoHabitacionService {
    @Autowired
    private TipoHabitacionRepository repository;

    public List<TipoHabitacion> listarTodos() {
        return repository.findAll();
    }
    public Optional<TipoHabitacion> obtenerPorId(Integer id) {
        return repository.findById(id);
    }
    public TipoHabitacion guardar(TipoHabitacion tipo) {
        return repository.save(tipo);
    }
    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
    public boolean existePorId(Integer id) {
        return repository.existsById(id);
    }
}