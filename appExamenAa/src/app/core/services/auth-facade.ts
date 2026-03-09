import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { JwtAuthService, LoginRequest, LoginResponse } from './jwt-auth';
import { KeycloakAuthService } from './keycloak-auth';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthFacadeService {
  private authMethod = environment.authMethod;
  private authState = new BehaviorSubject<boolean>(false);
  authState$ = this.authState.asObservable();

  constructor(
    private jwtAuth: JwtAuthService,
    private keycloakAuth: KeycloakAuthService
  ) {
    // Inicializar el estado al cargar el servicio
    this.checkInitialAuth();
  }

  private async checkInitialAuth() {
    const authenticated = await this.isAuthenticated();
    this.authState.next(authenticated);
  }

  login(credentials?: LoginRequest): Observable<LoginResponse | null> {
    if (this.authMethod === 'jwt') {
      return this.jwtAuth.login(credentials!).pipe(
        tap(response => {
          // Si el login es exitoso, actualizar estado a true
          if (response) {
            this.authState.next(true);
          }
        })
      );
    } else {
      // Keycloak maneja su propio flujo, pero podemos escuchar eventos si es necesario
      this.keycloakAuth.login();
      // No podemos saber cuándo termina, pero keycloak probablemente redirige
      // Podríamos asumir que después de redirigir volverá y se actualizará con checkInitialAuth
      return of(null);
    }
  }

  logout(): void {
    if (this.authMethod === 'jwt') {
      this.jwtAuth.logout();
    } else {
      this.keycloakAuth.logout();
    }
    // En ambos casos, después de logout, el estado debe ser false
    this.authState.next(false);
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
      const result = this.jwtAuth.isAuthenticated();
      console.log('JWT isAuthenticated:', result);
      return result;
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