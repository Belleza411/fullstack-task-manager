import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth, AuthResponse, Login} from '../models/auth.model';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { handleError } from '../../core/error/handleError';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly url = 'https://localhost:7234/api/Auth';
  private readonly tokenKey = 'access_token';
  private readonly refreshTokenKey = 'refresh_token';
  private http = inject(HttpClient);
  private router = inject(Router);

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  login(credentials: Login): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/login`, credentials)
      .pipe(
        tap(response => {          
          localStorage.setItem(this.tokenKey, response.accessToken);
          localStorage.setItem(this.refreshTokenKey, response.refreshToken);
          this.isLoggedInSubject.next(true);
        }),
        catchError(handleError('logging in'))
      )
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  getToken() {
    const token = localStorage.getItem(this.tokenKey);

    if (!token || token === 'undefined' || token === 'null') {
      return null;
    }
    return token;
  }

  getRefreshToken(): string | null {
    const refreshToken = localStorage.getItem(this.refreshTokenKey);
    return refreshToken;
    
  }

  register(credentials: Auth): Observable<Auth> {
    return this.http.post<Auth>(`${this.url}/register`, credentials, {
      responseType: 'json'
    })
      .pipe(
        catchError(handleError('registering'))
      )
  }

  refreshToken() {
    const accessToken = this.getToken();
    const refreshToken = this.getRefreshToken();

    return this.http.post<any>(`${this.url}/refresh-token`, {
      accessToken: accessToken,
      refreshToken: refreshToken
    }).pipe(
      tap(response => {    
        localStorage.setItem(this.tokenKey, response.accessToken);
        localStorage.setItem(this.refreshTokenKey, response.refreshToken);
        console.log('Im refreshed');
      })
    );
  }
}
