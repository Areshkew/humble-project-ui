import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { RouterLink } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { LoadingService } from '@services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule, IconComponent, RouterLink,
    ProgressBarModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit, OnDestroy {
  loadingSuscription!: Subscription;
  loading: boolean = false;

  constructor(private loadingService: LoadingService){}

  ngOnInit(): void{
    this.loadingSuscription = this.loadingService.loading$.subscribe(
      (isLoading: boolean) => {
        this.loading = isLoading;
    });
  }

  ngOnDestroy(): void{
    if(this.loadingSuscription) this.loadingSuscription.unsubscribe();
  }

}
