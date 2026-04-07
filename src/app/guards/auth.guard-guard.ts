import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/services/auth.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.precisaTrocarSenha() && state.url !== '/redefinir-senha') {
    router.navigate(['/redefinir-senha']);
    return false;
  }

  return true;
};
