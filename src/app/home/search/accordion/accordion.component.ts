import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IconComponent } from '../../../shared/icon/icon.component';
import { GENRES } from '@models/genres';
import { CommonModule, NgClass, formatDate } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { PRICES } from '@models/prices';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { concatAll } from 'rxjs';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [
    IconComponent,
    NgClass,
    AccordionModule,
    CommonModule,
    CalendarModule,
    FormsModule,
  ],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
})
export class AccordionComponent implements OnInit{
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
  currentLanguage: string | null = null;
  sortOrder: string | null = null;
  selectedDate: Date | null = null;
  selectedDateFormated: string | null = null;

  maxDate: Date = new Date();

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const categoryKey = params['categoria'];
      const price = params['precioId']
      const state = params['estado']
      const languaje = params['idioma']
      const date = params['fecha']
      
      if (categoryKey) {
        const selectedBook = this.booksGenres.find(book => book.key === categoryKey);
        if (selectedBook) {
          this.currentGenre = selectedBook.genero;
          this.currentGenreKey = categoryKey;
        }
      } 

      if(price) {
        this.currentIdPrice = price
        this.currentMinPrice = params['precioMin']
        this.currentMaxPrice = params['precioMax']
        this.sortOrder = params['orden']
      } 

      if(state){
        this.isNew = state
      }
      if(languaje){
        this.currentLanguage= languaje
      }
      if(date){
        this.selectedDateFormated
      }

    });
  }

  onCategorySelected(book: any) {
    this.currentGenre = book.genero;
    this.currentGenreKey = book.key;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { categoria: this.currentGenreKey },
      queryParamsHandling: 'merge',
    });
    this.emitFilters();
  }

  onPriceSelected(price: any) {
    this.currentIdPrice = price.id;
    this.currentMaxPrice = price.maxPrice;
    this.currentMinPrice = price.minPrice;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        precioId: this.currentIdPrice,
        precioMax: this.currentMaxPrice,
        precioMin: this.currentMinPrice,
      },
      queryParamsHandling: 'merge',
    });
    this.emitFilters();
  }

  onStateSelected(isNew: string) {
    this.isNew = isNew;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        estado: this.isNew,
    },
      queryParamsHandling: 'merge' 
  });
    this.emitFilters();
  }

  onLanguageSelected(language: string) {
    this.currentLanguage = language;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        idioma: this.currentLanguage,
    },
      queryParamsHandling: 'merge' 
  });
    this.emitFilters();
  }

  onSortSelected(sortOrder: string) {
    this.sortOrder = sortOrder;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        orden: this.sortOrder,
    },
      queryParamsHandling: 'merge' 
    });
    this.emitFilters();
  }

  onDateSeleted(date: string) {
    this.selectedDateFormated = formatDate(date, 'yyyy-MM-dd', 'en-US');
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        fecha: this.selectedDateFormated,
    },
      queryParamsHandling: 'merge' 
  });
    this.emitFilters();
  }




  //Clear
  clearCategory(event?: MouseEvent) {
    if(event){
      event.stopPropagation();
    }
    this.currentGenre = null;
    this.currentGenreKey = null;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { categoria: null },
      queryParamsHandling: 'merge',
    });
    this.emitFilters();
  }

  clearPrice(event?: MouseEvent) {
    if(event){
      event.stopPropagation();
    }
    this.currentIdPrice = null;
    this.currentMinPrice = null;
    this.currentMaxPrice = null;
    this.sortOrder = null;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        precioId: null,
        precioMax: null,
        precioMin: null,
        orden: null,
      },
      queryParamsHandling: 'merge',
    });
    this.emitFilters();
  }

  clearState(event: MouseEvent) {
    event.stopPropagation();
    this.isNew = null;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        estado: null,
    },
      queryParamsHandling: 'merge' 
  });
    this.emitFilters();
  }

  clearLanguage(event: MouseEvent) {
    event.stopPropagation();
    this.currentLanguage = null;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        idioma: null,
    },
      queryParamsHandling: 'merge' 
  });
    this.emitFilters();
  }

  clearPublicationDate(event: MouseEvent) {
    event.stopPropagation();
    this.selectedDate = null;
    this.selectedDateFormated = null;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        fecha: null,
    },
      queryParamsHandling: 'merge' 
  });
    this.emitFilters();
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
    this.selectedDate = null;
    this.selectedDateFormated = null;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
          categoria: null,
          precioId: null,
          precioMax: null,
          precioMin: null,
          estado: null,
          idioma: null,
          orden: null,
          fecha: null
      },
      queryParamsHandling: 'merge'
  });
    this.emitFilters();
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
      page: null,
    };
    this.filtersChanged.emit(filters);
    
  }
}
