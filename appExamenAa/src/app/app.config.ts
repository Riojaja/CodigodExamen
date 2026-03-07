import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideKeycloak, KeycloakService } from 'keycloak-angular';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { environment } from '../environments/environment';

function initializeKeycloak(keycloakService: KeycloakService) {
  return () =>
    keycloakService.init({
      config: {
        url: environment.keycloakConfig.url,
        realm: environment.keycloakConfig.realm,
        clientId: environment.keycloakConfig.clientId
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false
      }
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    // Solo si el método es keycloak, añadimos los proveedores de Keycloak
    ...(environment.authMethod === 'keycloak' ? [
      KeycloakService,
      {
        provide: APP_INITIALIZER,
        useFactory: initializeKeycloak,
        deps: [KeycloakService],
        multi: true
      }
    ] : [])
  ]
};