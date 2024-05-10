import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IconComponent } from '../../../shared/icon/icon.component';
import { GENRES } from '@models/genres';
import { CommonModule, NgClass, formatDate } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { PRICES } from '@models/prices';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { PAGES } from '@models/bookPages';

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
    DropdownModule
  ],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
})
export class AccordionComponent implements OnInit{
  @Output() filtersChanged: EventEmitter<any> = new EventEmitter<any>();

  booksGenres = GENRES;
  booksPrices = PRICES;
  booksPages = PAGES;
  showTooltip = false;
  years: any[] = [];

  currentGenre: string | null = null;
  currentGenreKey: string | null = null;
  currentIdPrice: number | null = null;
  currentMinPrice: number | null = null;
  currentMaxPrice: number | null = null;
  currentIdPage: number | null = null;
  currentMinPage: number | null = null;
  currentMaxPage: number | null = null;
  isNew: string | null = null;
  currentLanguage: string | null = null;
  sortOrder: string | null = null;
  selectedStartDate: Date | null = null;
  selectedStartDateFormated: string | null = null;
  selectedEndDate: Date | null = null;
  selectedEndDateFormated: string | null = null;
  selectedYear: string | null = null;
  yearDrop: string | null = null

  maxDate: Date = new Date();

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.years = [];  
    for (let year = currentYear; year >= 1990; year--) {
        this.years.push({label: year.toString(), value: year});
    }
    
    this.activatedRoute.queryParams.subscribe(params => {
      const categoryKey = params['categoria'];
      const price = params['precioId']
      const state = params['estado']
      const languaje = params['idioma']
      const endDate = params['fechaFinal']
      const page = params['paginaId']
      
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
        this.currentLanguage = languaje
      }
      if (params['fechaInicio']) {
        const dateParts = params['fechaInicio'].split('-').map(Number);
        this.selectedStartDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      } 
    
      if (params['fechaFinal']) {
        const dateParts = params['fechaFinal'].split('-').map(Number);
        this.selectedEndDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      } 
      if(page){
        this.currentIdPage = page
        this.currentMinPage = params['paginaMin']
        this.currentMaxPage = params['paginaMax']
      }
      if(params['año']){
        this.selectedYear = params['año'];
        const selectedYearObj = this.years.find(year => year.value.toString() === params['año']);
        if (selectedYearObj) {
            this.yearDrop = selectedYearObj;
        } 
        
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

  onPageSelected(page: any) {
    this.currentIdPage = page.id;
    this.currentMaxPage = page.maxPage;
    this.currentMinPage = page.minPage;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        paginaId: this.currentIdPage,
        paginaMax: this.currentMaxPage,
        paginaMin: this.currentMinPage,
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

  onYearSelected(year: any) {
    this.selectedYear = year.label;
    this.yearDrop = year;
    console.log(this.yearDrop);
    
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        año: this.selectedYear,
        añoDrop: this.yearDrop
    },
      queryParamsHandling: 'merge' 
    });
    this.emitFilters();
  }

  onDateStartSelected(date: string) {
    this.selectedStartDateFormated = formatDate(date, 'yyyy-MM-dd', 'en-US');
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        fechaInicio: this.selectedStartDateFormated,
        fechaInicioCalendar: date
    },
      queryParamsHandling: 'merge' 
  });
    this.emitFilters();
  }

  onDateEndSelected(date: string) {
    this.selectedEndDateFormated = formatDate(date, 'yyyy-MM-dd', 'en-US');
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        fechaFinal: this.selectedEndDateFormated,
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

  clearPage(event?: MouseEvent) {
    if(event){
      event.stopPropagation();
    }
    this.currentIdPage = null
    this.currentMaxPage = null;
    this.currentMinPage = null;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        paginaId: null,
        paginaMax: null,
        paginaMin: null,
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

  clearYear(event: MouseEvent){
    event.stopPropagation();
    this.selectedYear = null;
    this.yearDrop = null;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        año: null,
        añoDrop: null,
    },
      queryParamsHandling: 'merge' 
    });
    this.emitFilters();
  }

  clearPublicationDate(event: MouseEvent) {
    event.stopPropagation();
    this.selectedStartDate = null;
    this.selectedStartDateFormated = null;
    this.selectedEndDate = null;
    this.selectedEndDateFormated = null;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        fechaInicio: null,
        fechaFinal: null,
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
    this.selectedYear = null;
    this.yearDrop = null,
    this.selectedStartDate = null;
    this.selectedStartDateFormated = null;
    this.selectedEndDate = null;
    this.selectedEndDateFormated = null;
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
          fechaInicio: null,
          fechaFinal: null,
          paginaId: null,
          paginaMax: null,
          paginaMin: null,
          año: null,
          añoDrop: null,
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
      start_date: this.selectedStartDateFormated,
      end_date: this.selectedEndDateFormated,
      min_page: this.currentMinPage,
      max_page: this.currentMaxPage,
      year_filter: this.selectedYear,
      size: null,
      page: null,
    };
    console.log(filters);
    
    this.filtersChanged.emit(filters);
    
  }
}
