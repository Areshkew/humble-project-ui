import { Component, HostListener} from '@angular/core';
import { Router, RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isMenuVisible: boolean = true;
  showMenu: boolean = false;

  constructor(private router: Router) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth < 600) {
      this.isMenuVisible = false; // Oculta el menú en pantallas pequeñas
      this.showMenu = false
    } else {
      this.isMenuVisible = true; // Muestra el menú en pantallas más grandes
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  goChangePassword() {
    this.router.navigate(['/root/dashboard/change-password']);
  }
  
  goAdmin() {
    this.router.navigate(['/root/dashboard/admin-users']);
  }
}
