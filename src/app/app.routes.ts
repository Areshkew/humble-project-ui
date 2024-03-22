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
        canActivate: [authGuard],
        children: [
            {path: '', redirectTo: 'enviar-correo', pathMatch: 'full' },
            {path: 'enviar-correo', loadComponent: () => import('./auth/recover/steps/send-email/send-email.component').then(m => m.SendEmailComponent)},
            {path: 'verificar-codigo', loadComponent: () => import('./auth/recover/steps/put-code/put-code.component').then(m => m.PutCodeComponent)},
            {path: 'ingresar-contraseña', loadComponent: () => import('./auth/recover/steps/new-password/new-password.component').then(m => m.NewPasswordComponent)}
        ] 
    },
    {
        path: 'editar-perfil',
        loadComponent: () => import('./edit-profile/edit-profile.component').then(m =>m.EditProfileComponent),
    }
];