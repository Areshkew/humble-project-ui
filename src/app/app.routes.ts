import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
    { 
        path: 'ingreso', 
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) 
    }, 
    { 
        path: 'registro', 
        loadComponent: () => import('./auth/signup/signup.component').then(m => m.SignupComponent) 
    }, 
    { 
        path: 'recuperar-contraseña', 
        loadComponent: () => import('./auth/recover/recover.component').then(m => m.RecoverComponent) 
    },
];
