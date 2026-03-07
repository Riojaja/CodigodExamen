import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthFacadeService } from '../services/auth-facade';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthFacadeService);
  const router = inject(Router);
  const isAuthenticated = await authService.isAuthenticated(); // authService es el unificado

  if (isAuthenticated) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};