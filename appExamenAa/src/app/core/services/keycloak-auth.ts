import { Injectable, Optional } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

export interface KeycloakUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  role: string; // Añadimos esta propiedad
}

@Injectable({
  providedIn: 'root'
})
export class KeycloakAuthService {
  constructor(@Optional() private keycloak: KeycloakService) {}

  login(): Promise<void> {
    if (!this.keycloak) {
      return Promise.reject('Keycloak no está configurado');
    }
    return this.keycloak.login();
  }

  logout(): Promise<void> {
    if (!this.keycloak) {
      return Promise.reject('Keycloak no está configurado');
    }
    return this.keycloak.logout(window.location.origin);
  }

  getToken(): Promise<string> {
    if (!this.keycloak) {
      return Promise.reject('Keycloak no está configurado');
    }
    return this.keycloak.getToken();
  }

  isAuthenticated(): Promise<boolean> {
    if (!this.keycloak) {
      return Promise.resolve(false);
    }
    return Promise.resolve(this.keycloak.isLoggedIn());
  }

  getUserProfile(): Promise<any> {
    if (!this.keycloak) {
      return Promise.reject('Keycloak no está configurado');
    }
    return this.keycloak.loadUserProfile();
  }

  getUserRoles(): string[] {
    if (!this.keycloak) {
      return [];
    }
    return this.keycloak.getUserRoles();
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  async getUser(): Promise<KeycloakUser | null> {
    if (!this.keycloak) {
      return null;
    }
    if (!(await this.isAuthenticated())) {
      return null;
    }
    try {
      const profile = await this.getUserProfile();
      const roles = this.getUserRoles();
      // Determinar el rol principal: si tiene ADMIN, es ADMIN; si no, USER (o el primero si existe)
      let role = 'USER';
      if (roles.includes('ADMIN')) {
        role = 'ADMIN';
      } else if (roles.length > 0) {
        role = roles[0]; // Opcional: usar el primer rol
      }
      return {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        roles,
        role // ← propiedad añadida
      };
    } catch (error) {
      console.error('Error al obtener el perfil de Keycloak', error);
      return null;
    }
  }
}