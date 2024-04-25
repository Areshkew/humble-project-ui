import { Component } from '@angular/core';
import { IconComponent } from '../../../shared/icon/icon.component';
import { GENRES } from '@models/genres';
import { NgClass } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [IconComponent, NgClass, AccordionModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css'
})
export class AccordionComponent {
  booksGenres = GENRES
  showTooltip = false;
  
  currentGenre:  string | null = null


  onCategorySelected(book: any) {
    this.currentGenre = book.genero;
    
    
    
    
  }

  clearSelection() {
    this.currentGenre = null;
    
    
  }
}
