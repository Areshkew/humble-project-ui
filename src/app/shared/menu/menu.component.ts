import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { Router, RouterLink } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { LoadingService } from '@services/loading.service';
import { Subscription } from 'rxjs';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api/menuitem';
import { PrimeIcons } from 'primeng/api';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    RouterLink,
    ProgressBarModule,
    MenuModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit, OnDestroy {
  loadingSuscription!: Subscription;
  loading: boolean = false;
  authenticationSuscription!: Subscription;
  authenticated!: boolean;
  items: MenuItem[] | undefined;

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authenticationSuscription =
      this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
        this.authenticated = isAuthenticated;
      });

    this.items = [
      {
        label: 'Configuración',
        icon: PrimeIcons.COG,
        routerLink: 'editar-perfil',
      },
      {
        label: 'Cerrar Sesión',
        icon: PrimeIcons.SIGN_OUT,
        command: () => this.authService.logout()
      },
    ];

    this.loadingSuscription = this.loadingService.loading$.subscribe(
      (isLoading: boolean) => {
        this.loading = isLoading;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.loadingSuscription) this.loadingSuscription.unsubscribe();
    if (this.authenticationSuscription)
      this.authenticationSuscription.unsubscribe();
  }

  toggleMenu(menu: any, event: Event) {
    if (!this.authenticated) this.router.navigate(['/ingreso']);
    else menu.toggle(event);
  }
}
