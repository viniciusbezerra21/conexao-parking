import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.endsWith('/login') || req.url.endsWith('/cadastro')) {
    return next(req);
  }

  const isPublic = ['/login', '/cadastro']
    .some(route => req.url.endsWith(route));
  
  if (isPublic) {
    return next(req);
  }
  
  const token = localStorage.getItem('token');

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq);
  }

  return next(req);
};