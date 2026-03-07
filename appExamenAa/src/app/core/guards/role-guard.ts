import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthFacadeService } from '../services/auth-facade';

export const roleGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthFacadeService);
  const router = inject(Router);
  const expectedRole = route.data['role'];
const isAuthenticated = await authService.isAuthenticated(); // Usa await
  const hasRole = await authService.hasRole(expectedRole);
  if (hasRole) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};