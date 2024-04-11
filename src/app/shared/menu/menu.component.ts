import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { Router, RouterLink } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { LoadingService } from '@services/loading.service';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api/menuitem';
import { PrimeIcons } from 'primeng/api';
import { AuthService } from '@services/auth/auth.service';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    RouterLink,
    ProgressBarModule,
    MenuModule,
    SearchResultsComponent,
    ReactiveFormsModule,
    DialogModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit, OnDestroy {
  loadingSuscription!: Subscription;
  authenticationSuscription!: Subscription;
  searchSuscription!: Subscription;
  loading: boolean = false;
  authenticated!: boolean;
  displayResults: boolean = false;
  visible: boolean = false;
  items: MenuItem[] | undefined;
  searchControl = new FormControl("");
  searchRequestValue!: string;

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,
    private router: Router,
    private cdref: ChangeDetectorRef
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

    this.searchSuscription = this.searchControl.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((value: any) => {
        if (value && value.length >= 3 && value.length <= 50) {
          this.searchRequestValue = value;
          this.displayResults = true;
        } else {
          this.displayResults = false;
        }
        this.cdref.detectChanges();
      })
  }

  ngOnDestroy(): void {
    if (this.loadingSuscription) this.loadingSuscription.unsubscribe();
    if (this.authenticationSuscription) this.authenticationSuscription.unsubscribe();
    if (this.searchSuscription) this.searchSuscription.unsubscribe();
  }

  toggleMenu(menu: any, event: Event) {
    if (!this.authenticated) this.router.navigate(['/ingreso']);
    else menu.toggle(event);
  }

  dialogSearch(){
    this.visible = !this.visible;
    this.searchRequestValue = "";
    this.displayResults = false;
    this.searchControl.setValue("");
  }
}
