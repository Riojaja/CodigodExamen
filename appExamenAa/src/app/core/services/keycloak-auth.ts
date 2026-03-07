import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

export interface KeycloakUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class KeycloakAuthService {
  constructor(private keycloak: KeycloakService) {} // Inyección normal

  login(): Promise<void> {
    return this.keycloak.login();
  }

  logout(): Promise<void> {
    return this.keycloak.logout(window.location.origin);
  }

  getToken(): Promise<string> {
    return this.keycloak.getToken();
  }

  isAuthenticated(): Promise<boolean> {
    return Promise.resolve(this.keycloak.isLoggedIn());
  }

  getUserProfile(): Promise<any> {
    return this.keycloak.loadUserProfile();
  }

  getUserRoles(): string[] {
    return this.keycloak.getUserRoles();
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  async getUser(): Promise<KeycloakUser | null> {
    if (!(await this.isAuthenticated())) {
      return null;
    }
    try {
      const profile = await this.getUserProfile();
      const roles = this.getUserRoles();
      return {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        roles
      };
    } catch (error) {
      console.error('Error al obtener el perfil de Keycloak', error);
      return null;
    }
  }
}