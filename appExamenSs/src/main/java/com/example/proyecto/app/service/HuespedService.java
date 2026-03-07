package com.example.proyecto.app.service;

import com.example.proyecto.app.model.Huesped;
import com.example.proyecto.app.repository.HuespedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class HuespedService {
    @Autowired
    private HuespedRepository repository;

    public List<Huesped> listarTodos() {
        return repository.findAll();
    }
    public Optional<Huesped> obtenerPorId(Integer id) {
        return repository.findById(id);
    }
    public Huesped guardar(Huesped huesped) {
        return repository.save(huesped);
    }
    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
    public boolean existePorId(Integer id) {
        return repository.existsById(id);
    }
}