import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './core/guards/auth.guard';
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: 'tasks',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: (() => 
            import('./tasks/tasks.routes').then(mod => mod.tasksRoutes
        ))
    },
    {
        path: 'auth',
        component: AuthComponent,
        loadChildren: (() => 
            import('./auth/auth.routes').then(mod => mod.authRoutes))
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
