import { ApplicationConfig, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { environment } from '../environments/environment';
import { KeycloakService } from 'keycloak-angular';


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
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      tapToDismiss: true
    }),
    importProvidersFrom(NgbModule),
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