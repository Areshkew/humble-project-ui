import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardShared } from '../dashboard.shared';
import { AuthService } from '@services/auth/auth.service';
import { Subscription } from 'rxjs';

import { ToastService } from '@services/utils/toast.service';
import { BookService } from '@services/book.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    DashboardShared,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy { 
  roleSuscription!: Subscription;
  role!: string;
  
  constructor(private authService: AuthService, private toastService: ToastService, private bookService: BookService){}

  ngOnInit(): void {
      this.roleSuscription = this.authService.role$.subscribe(value => {
        this.role = value;
      });
  }

  ngOnDestroy(): void {
      if(this.roleSuscription) this.roleSuscription.unsubscribe();
  }
  
  simularEnvio(): void{
    this.bookService.entregarTodos().subscribe({
      next: (response) => {
        if (response.Success) {
          this.toastService.showSuccessToast("Exito", "Todos fueron entregados");
        }
      }
    });
  }
}
