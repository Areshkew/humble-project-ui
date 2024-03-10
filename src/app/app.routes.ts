import { Routes } from '@angular/router';
import { authGuard } from '@services/auth/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
    { 
        path: 'ingreso', 
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
        data: { Guest: true }, 
        canActivate: [authGuard]
    }, 
    { 
        path: 'registro', 
        loadComponent: () => import('./auth/signup/signup.component').then(m => m.SignupComponent),
        data: { Guest: true }, 
        canActivate: [authGuard]
    }, 
    { 
        path: 'recuperar-contraseña', 
        loadComponent: () => import('./auth/recover/recover.component').then(m => m.RecoverComponent),
        data: { Guest: true }, 
        canActivate: [authGuard] 
    },
];
