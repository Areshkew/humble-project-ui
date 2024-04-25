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
  @Output() selectedGenre = new EventEmitter<string | null>(); 
  currentGenre:  string | null = null


  onCategorySelected(book: any) {
    this.currentGenre = book.genero;
    
    
    this.selectedGenre.emit(book.key);
    
  }

  clearSelection() {
    this.currentGenre = null;
    this.selectedGenre.emit(null);
    
  }
}
