import { Component } from '@angular/core';
import { Router, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router: Router) {}

  goChangePassword() {
    this.router.navigate(['/root/dashboard/change-password']);
  }
  
  goAdmin() {
    this.router.navigate(['/root/dashboard/admin-users']);
  }
}
