import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/services/auth.service';
import { inject } from '@angular/core';

export const forcaRedefinicaoSenhaGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.precisaTrocarSenha()) {
    return true;
  }

  router.navigate(['/home']);
  return false;
};
