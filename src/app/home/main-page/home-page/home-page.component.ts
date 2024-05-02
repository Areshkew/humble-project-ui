import { Component, OnInit } from '@angular/core';
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
export class HomePageComponent implements OnInit{
  sidebarVisible = true;
  filters: any

  ngOnInit(): void {
    this.handleFiltersChanged({})
  }

  showSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  handleFiltersChanged(filters: any) {
    this.filters = filters
    this.filters.size = 18
    console.log('datos busqueda catego', filters);
  }
}
