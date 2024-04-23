import { Component } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { CommonModule, NgClass } from '@angular/common';
import { BooksComponent } from '../books/books.component';
import { CarouselModule } from 'primeng/carousel';
import { environment } from '../../../environments/environment';
import { RecommendationBoardComponent } from '../recommendation-board/recommendation-board.component';

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
    BooksComponent,
    CarouselModule,
    RecommendationBoardComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  imageUrl: string = environment.api_host;  
  sidebarVisible = true;
  

  showSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
