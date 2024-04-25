import { Component } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';

import { IconComponent } from '../../../shared/icon/icon.component';
import { CommonModule, NgClass } from '@angular/common';
import { BooksComponent } from '../../books/books.component';
import { CarouselModule } from 'primeng/carousel';
import { RecommendationBoardComponent } from '../recommendation-board/recommendation-board.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

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
  sidebarVisible = true;
  selectedCategory: string | null = null;
  booksNumber = 18;

  showSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onGenreSelected(genre: string | null): void {
    this.selectedCategory = genre; 
       
  }
}
