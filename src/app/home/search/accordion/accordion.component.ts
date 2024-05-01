import { Component, EventEmitter, Output } from '@angular/core';
import { IconComponent } from '../../../shared/icon/icon.component';
import { GENRES } from '@models/genres';
import { CommonModule, NgClass } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { PRICES } from '@models/prices';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [IconComponent, NgClass, AccordionModule, CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css'
})
export class AccordionComponent {

  @Output() filtersChanged: EventEmitter<any> = new EventEmitter<any>();

  booksGenres = GENRES;
  booksPrices = PRICES;
  showTooltip = false;
  
  currentGenre: string | null = null;
  currentIdPrice: number | null = null;
  currentMinPrice: number | null = null;
  currentMaxPrice: number | null = null;
  isNew: boolean | null = null;
  currentLanguage: string | null = null 
  sortOrder: string | null = null;
  
  onCategorySelected(book: any) {
      this.currentGenre = book.genero;
      this.emitFilters() 
  }

  onPriceSelected(price: any) {
    this.currentIdPrice = price.id
      this.currentMaxPrice = price.maxPrice;
      this.currentMinPrice = price.minPrice;
      this.emitFilters()
  }

  onStateSelected(isNew: boolean) {
      this.isNew = isNew; 
      this.emitFilters()
  }

  onLanguageSelected(language: string) {
    this.emitFilters()
}

  onSortSelected(sortOrder: string) {
    this.sortOrder = sortOrder;
    this.emitFilters()
  }


  clearSelection() {
    this.currentGenre = null;
    this.currentIdPrice = null;
    this.currentMinPrice = null;
    this.currentMaxPrice = null;
    this.isNew = null;
    this.currentLanguage = null;
    this.sortOrder = null;
    this.emitFilters()
}

emitFilters() {
  const filters = {
    currentGenre: this.currentGenre,
    currentMinPrice: this.currentMinPrice,
    currentMaxPrice: this.currentMaxPrice,
    isNew: this.isNew,
    currentLanguage: this.currentLanguage,
    sortOrder: this.sortOrder
  };
  this.filtersChanged.emit(filters);
}

}



