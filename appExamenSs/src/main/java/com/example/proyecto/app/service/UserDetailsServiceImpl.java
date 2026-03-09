package com.example.proyecto.app.service;

import com.example.proyecto.app.model.Usuario;
import com.example.proyecto.app.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Collections;

@Service
@Transactional
@Profile("jwt")
public class UserDetailsServiceImpl implements UserDetailsService {
	@Autowired
	private UsuarioRepository usuarioRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Usuario usuario = usuarioRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
		SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + usuario.getRole().toUpperCase());
		return new User(usuario.getUsername(), usuario.getPassword(), Collections.singletonList(authority));
	}
}