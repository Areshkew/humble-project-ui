import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IconComponent } from '../shared/icon/icon.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { LoadingService } from '@services/utils/loading.service';
import { Subscription } from 'rxjs';
import { AuthService } from '@services/auth/auth.service';
import { ToastService } from '@services/utils/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, IconComponent, RouterOutlet, RouterLink,
    ProgressBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy{
  loading: boolean = false;
  loadingSuscription!: Subscription;
  roleSubscription!: Subscription;
  role!: string;

  constructor(private loadingService: LoadingService, private authService: AuthService, private router: Router, private toastService: ToastService){}

  ngOnInit(): void {
    this.loadingSuscription = this.loadingService.loading$.subscribe(
      (isLoading: boolean) => {
        this.loading = isLoading;
      }
    );

    this.roleSubscription = this.authService.role$.subscribe(role => {
      this.role = role;
    });

  }

  logOut(){
    this.toastService.showInfoToast("Información", "Se cerró la sesión correctamente.")
    this.router.navigate(['/inicio']);
    return this.authService.logout();
  }
  
  ngOnDestroy(): void {
      if(this.loadingSuscription) this.loadingSuscription.unsubscribe();
      if(this.roleSubscription) this.roleSubscription.unsubscribe();
  }
 }