import { Routes } from '@angular/router';
import { authGuard } from '@services/auth/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', loadComponent: () => import('./home/main-page/home-page/home-page.component').then(m => m.HomePageComponent) },
    { path: 'busqueda-avanzada', loadComponent: () => import('./home/search/advanced-search/advanced-search.component').then(m => m.AdvancedSearchComponent)},
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
        loadComponent: () => import('./user/edit-profile/edit-profile.component').then(m =>m.EditProfileComponent),
        data: { Roles: ['cliente'] }, 
        canActivate: [authGuard],
        children: [
            {path: '', redirectTo: 'informacion-personal', pathMatch: 'full'},
            {path: 'informacion-personal', loadComponent: () => import('./user/edit-profile/tabs/personal-info/personal-info.component').then(m => m.PersonalInfoComponent)},
            {path: 'gestion-financiera', loadComponent: () => import('./user/edit-profile/tabs/financial-info/financial-info.component').then(m => m.FinancialInfoComponent)}
        ]
    },
    {
        path: 'panel-admin',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { Roles: ['admin', 'root'] },
        canActivate: [authGuard],
        children: [
            {path: '', redirectTo: 'dashboard-inicio', pathMatch: 'full'},
            {path: 'dashboard-inicio', loadComponent: () => import('./dashboard/home/home.component').then(m => m.HomeComponent)},
            {
                path: 'administradores', 
                data: { Roles: ['root'] },
                loadComponent: () => import('./dashboard/admins/admins.component').then(m => m.AdminsComponent),
                canActivate: [authGuard],
            },
            {
                path: 'contrasena-root', 
                data: { Roles: ['root'] },
                loadComponent: () => import('./dashboard/contrasena-root/contrasena-root.component').then(m => m.ContrasenaRootComponent),
                canActivate: [authGuard],
            },
            {path: 'libros', loadComponent: () => import('./dashboard/books/books.component').then(m => m.BooksComponent)},
            {path: 'tiendas', loadComponent: () => import('./dashboard/shops/shops.component').then(m => m.ShopsComponent)},
            {path: 'pqrs', loadComponent: () => import('./dashboard/support/support.component').then(m => m.SupportComponent)},
        ]
    }
];