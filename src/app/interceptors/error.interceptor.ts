import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Erro capturado pelo Interceptor:', error);
      
      if (error.status === 403 && authService.precisaTrocarSenha()) {
        router.navigate(['/redefinir-senha']);
      }
      
      return throwError(() => error);
    })
  );
};
