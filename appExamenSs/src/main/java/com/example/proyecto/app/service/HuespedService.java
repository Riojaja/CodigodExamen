package com.example.proyecto.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.proyecto.app.model.Huesped;
import com.example.proyecto.app.repository.HuespedRepository;

import java.util.List;

@Service
public class HuespedService {

    @Autowired
    private HuespedRepository repository;

    public List<Huesped> listarTodos() {
        return repository.findAll();
    }

    public Huesped guardar(Huesped huesped) {
        return repository.save(huesped);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }

    public Huesped buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }
}
