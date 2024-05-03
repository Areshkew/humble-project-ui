import { Component, EventEmitter, Output } from '@angular/core';
import { IconComponent } from '../../../shared/icon/icon.component';
import { GENRES } from '@models/genres';
import { CommonModule, NgClass, formatDate } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { PRICES } from '@models/prices';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [IconComponent, NgClass, AccordionModule, CommonModule,
    CalendarModule, FormsModule, ],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css'
})
export class AccordionComponent {

  @Output() filtersChanged: EventEmitter<any> = new EventEmitter<any>();

  booksGenres = GENRES;
  booksPrices = PRICES;
  showTooltip = false;
  
  currentGenre: string | null = null;
  currentGenreKey: string | null = null;
  currentIdPrice: number | null = null;
  currentMinPrice: number | null = null;
  currentMaxPrice: number | null = null;
  isNew: string | null = null;
  currentLanguage: string | null = null 
  sortOrder: string | null = null;
  selectedDate: Date | null = null
  selectedDateFormated: string | null = null

  maxDate: Date = new Date();
  
  onCategorySelected(book: any) {
      this.currentGenre = book.genero;
      this.currentGenreKey = book.key
      this.emitFilters() 
  }

  onPriceSelected(price: any) {
    this.currentIdPrice = price.id
      this.currentMaxPrice = price.maxPrice;
      this.currentMinPrice = price.minPrice;
      this.emitFilters()
  }

  onStateSelected(isNew: string) {
      this.isNew = isNew; 
      this.emitFilters()
  }

  onLanguageSelected(language: string) {
    this.currentLanguage = language
    this.emitFilters()
}

  onSortSelected(sortOrder: string) {
    this.sortOrder = sortOrder;
    this.emitFilters()
  }

  onDateSeleted(date: string) {
    this.selectedDateFormated = formatDate(date, 'yyyy-MM-dd', 'en-US');
    this.emitFilters()
  }


  clearSelection() {
    this.currentGenre = null;
    this.currentGenreKey = null;
    this.currentIdPrice = null;
    this.currentMinPrice = null;
    this.currentMaxPrice = null;
    this.isNew = null;
    this.currentLanguage = null;
    this.sortOrder = null;
    this.selectedDate = null
    this.selectedDateFormated = null
    this.emitFilters()
}

emitFilters() {
  const filters = {
    category: this.currentGenreKey,
      min_price: this.currentMinPrice,
      max_price: this.currentMaxPrice,
      state: this.isNew,
      language: this.currentLanguage,
      price_order: this.sortOrder,
      publication_date: this.selectedDateFormated,
      size: null,
      page: null
  };
  this.filtersChanged.emit(filters);
}

}



