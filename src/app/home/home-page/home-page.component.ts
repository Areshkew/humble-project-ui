import { Component } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { CommonModule, NgClass } from '@angular/common';
import { BooksComponent } from '../books/books.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    SidebarModule,
    ButtonModule,
    SidebarComponent,
    IconComponent,
    NgClass,
    CommonModule,
    BooksComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  sidebarVisible = true;
  

  showSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
