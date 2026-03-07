import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { JwtAuthService, LoginRequest, LoginResponse } from './jwt-auth';
import { KeycloakAuthService } from './keycloak-auth';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthFacadeService {
  private authMethod = environment.authMethod;

  constructor(
    private jwtAuth: JwtAuthService,
    private keycloakAuth: KeycloakAuthService
  ) {}

  login(credentials?: LoginRequest): Observable<LoginResponse | null> {
    if (this.authMethod === 'jwt') {
      return this.jwtAuth.login(credentials!);
    } else {
      this.keycloakAuth.login();
      return of(null);
    }
  }

  logout(): void {
    if (this.authMethod === 'jwt') {
      this.jwtAuth.logout();
    } else {
      this.keycloakAuth.logout();
    }
  }

  async getToken(): Promise<string | null> {
  if (this.authMethod === 'jwt') {
    return Promise.resolve(this.jwtAuth.getToken());
  } else {
    return await this.keycloakAuth.getToken();
  }
}

  async isAuthenticated(): Promise<boolean> {
    if (this.authMethod === 'jwt') {
      return this.jwtAuth.isAuthenticated();
    } else {
      return await this.keycloakAuth.isAuthenticated();
    }
  }

  async hasRole(role: string): Promise<boolean> {
    if (this.authMethod === 'jwt') {
      return this.jwtAuth.hasRole(role);
    } else {
      return this.keycloakAuth.hasRole(role);
    }
  }

  async getUser(): Promise<any> {
    if (this.authMethod === 'jwt') {
      return this.jwtAuth.getUser();
    } else {
      return await this.keycloakAuth.getUser();
    }
  }
}