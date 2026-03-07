package com.example.proyecto.app.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.proyecto.app.model.Usuario;
import com.example.proyecto.app.repository.UsuarioRepository;

import java.util.Optional;

@Service
@Transactional
@Profile("jwt")
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Optional<Usuario> findByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    // Métodos CRUD básicos (opcional)
    public Usuario guardar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> obtenerPorId(Integer id) {
        return usuarioRepository.findById(id);
    }

    public void eliminar(Integer id) {
        usuarioRepository.deleteById(id);
    }
}