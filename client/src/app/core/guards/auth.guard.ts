// src/app/guards/auth.guard.ts
import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    private authService = inject(AuthService);
    private router = inject(Router);

    canActivate(): boolean {
        if (!this.authService.getToken()) {
            this.router.navigate(['/login']);
            return false;
        }
        
        return true;
    }
}
