import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IconComponent } from '../../../shared/icon/icon.component';
import { NgClass } from '@angular/common';
import { BooksComponent } from '../../books/books.component';
import { RecommendationBoardComponent } from '../recommendation-board/recommendation-board.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    SidebarComponent,
    IconComponent,
    NgClass,
    BooksComponent,
    RecommendationBoardComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit{
  sidebarVisible = true;
  filters: any

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const category = params['categoria'];
      if (category) {
        this.handleFiltersChanged({ category: category });
      } else {
        this.handleFiltersChanged({});
      }
    });
  }

  showSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  handleFiltersChanged(filters: any) {
    this.filters = filters
    this.filters.size = 18
    
  }
}
