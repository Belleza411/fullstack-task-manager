// src/app/interceptors/auth.interceptor.ts
import {
  HttpEvent,
  HttpRequest,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpHandlerFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {    
  const authService = inject(AuthService);
  const accessToken = authService.getToken();
  const refreshToken = authService.getRefreshToken();
  
  if (accessToken && accessToken !== 'undefined' && accessToken !== 'null') {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }
  
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {      
      if (err.status === 401) {
        if (refreshToken && refreshToken !== 'undefined' && refreshToken !== 'null') {
          return handle401Error(req, next, authService);
        } else {
          authService.logout();
          return throwError(() => err);
        }
      }
      return throwError(() => err);
    })
  );
};

const handle401Error = (
    req: HttpRequest<unknown>, 
    next: (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>, 
    authService: AuthService
): Observable<HttpEvent<unknown>> => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response: any) => {
        isRefreshing = false;        
        const newToken = response.jwtToken || response.accessToken || response.access_token || response.token;
        
        if (newToken) {
          refreshTokenSubject.next(newToken);

          const cloned = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` }
          });
          
          return next(cloned);
        } else {
          authService.logout();
          return throwError(() => new Error('Token refresh failed - no token in response'));
        }
      }),
      catchError((err) => {
        isRefreshing = false;
        console.error('❌ Refresh token error:', err);
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next(cloned);
      })
    );
  }
}