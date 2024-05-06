import { NgClass } from '@angular/common';
import { Component, NgModule , EventEmitter, Output} from '@angular/core';
import { GENRES } from '@models/genres';
import { IconComponent } from '../../../shared/icon/icon.component';
import { RouterLink, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


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

  constructor(private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const categoryKey = params['categoria'];
      if (categoryKey) {
        const selectedBook = this.booksGenres.find(book => book.key === categoryKey);
        if (selectedBook) {
          this.currentGenre = selectedBook.genero;
          this.currentGenreKey = categoryKey;
        }
      } else {
        this.clearSelection();
      }
    });
  }

  onCategorySelected(book: any) {
    this.currentGenre = book.genero;
    this.currentGenreKey = book.key;
    this.router.navigate([], { queryParams: { categoria: this.currentGenreKey } });
    this.emitFilters()
    
  }

  clearSelection() {
    this.currentGenre = null;
    this.currentGenreKey = null;
    this.router.navigate([], { queryParams: { categoria: null } });
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
