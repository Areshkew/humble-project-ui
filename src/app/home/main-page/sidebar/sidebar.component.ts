import { NgClass } from '@angular/common';
import { Component, NgModule , EventEmitter, Output} from '@angular/core';
import { GENRES } from '@models/genres';
import { IconComponent } from '../../../shared/icon/icon.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, IconComponent, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  booksGenres = GENRES
  @Output() filtersChanged: EventEmitter<any> = new EventEmitter<any>();
  currentGenre:  string | null = null
  currentGenreKey:  string | null = null


  onCategorySelected(book: any) {
    this.currentGenre = book.genero;
    this.currentGenreKey = book.key;
    this.emitFilters()
    
  }

  clearSelection() {
    this.currentGenre = null;
    this.emitFilters()
    
  }
  emitFilters() {
    const filters = {
      category: this.currentGenreKey,
      min_price: null,
      max_price: null,
      state: null,
      language: null,
      price_order: null,
      size: null,
      page: null
    };
    this.filtersChanged.emit(filters);
  }
}
