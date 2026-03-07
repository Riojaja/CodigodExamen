import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthFacadeService } from '../services/auth-facade';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthFacadeService);
  return from(authService.getToken()).pipe(
    switchMap(token => {
      console.log('Token en interceptor:', token); // Para depurar
      if (token) {
        const cloned = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(cloned);
      }
      return next(req);
    })
  );
};