import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const publicRoutes = ['/login', '/usuario/check-email'];

  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));


  const token = localStorage.getItem('token');


  if (!isPublicRoute && token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }


  return next(req);
};