package com.example.proyecto.app.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
@Profile("keycloak")
public class KeycloakConfig {

    private static final Logger log = LoggerFactory.getLogger(KeycloakConfig.class);

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/**").hasAnyRole("ADMIN", "USER")
                .requestMatchers("/api/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/upload").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            );
        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            log.info("=== Procesando token JWT ===");
            log.info("=== Procesando token JWT de Keycloak ===");
            log.info("Claims: {}", jwt.getClaims());

            List<GrantedAuthority> authorities = new ArrayList<>();

            // 1. Buscar en realm_access.roles
            Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
            if (realmAccess != null && realmAccess.get("roles") != null) {
                Collection<String> roles = (Collection<String>) realmAccess.get("roles");
                log.info("Roles en realm_access: {}", roles);
                roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .forEach(authorities::add);
            }

            // 2. Buscar en resource_access.<client-id>.roles
            Map<String, Object> resourceAccess = jwt.getClaimAsMap("resource_access");
            if (resourceAccess != null) {
                // Reemplaza "hotel-app" con el clientId de tu Keycloak (el mismo del environment)
                Map<String, Object> clientAccess = (Map<String, Object>) resourceAccess.get("hotel-app");
                if (clientAccess != null && clientAccess.get("roles") != null) {
                    Collection<String> roles = (Collection<String>) clientAccess.get("roles");
                    log.info("Roles en resource_access (hotel-app): {}", roles);
                    roles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .forEach(authorities::add);
                }
            }

            // Si no se encontraron roles, asignar uno por defecto? Mejor dejarlo vacío.
            log.info("Autoridades generadas: {}", authorities);
            return authorities;
        });
        return converter;
    }
}