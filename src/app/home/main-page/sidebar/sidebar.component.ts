import { NgClass } from '@angular/common';
import { Component, NgModule , EventEmitter, Output} from '@angular/core';
import { GENRES } from '@models/genres';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  booksGenres = GENRES
  @Output() filtersChanged: EventEmitter<any> = new EventEmitter<any>();
  currentGenre:  string | null = null


  onCategorySelected(book: any) {
    this.currentGenre = book.genero;
    this.emitFilters()
    
  }

  clearSelection() {
    this.currentGenre = null;
    this.emitFilters()
    
  }
  emitFilters() {
    const filters = {
      currentGenre: this.currentGenre,
      currentMinPrice: null,
      currentMaxPrice: null,
      isNew: null,
      currentLanguage: null,
      sortOrder: null,
      size: null,
      page: null
    };
    this.filtersChanged.emit(filters);
  }
}
