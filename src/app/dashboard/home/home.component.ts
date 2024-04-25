import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardShared } from '../dashboard.shared';
import { AuthService } from '@services/auth/auth.service';
import { Subscription } from 'rxjs';

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
  
  constructor(private authService: AuthService){}

  ngOnInit(): void {
      this.roleSuscription = this.authService.role$.subscribe(value => {
        this.role = value;
      });
  }

  ngOnDestroy(): void {
      if(this.roleSuscription) this.roleSuscription.unsubscribe();
  }
  
}
