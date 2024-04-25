import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IconComponent } from '../../shared/icon/icon.component';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { BookService } from '@services/book.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [IconComponent, CommonModule, PaginatorModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnChanges{
  imageUrl: string = environment.api_host;
  @Input() category: string | null = null;
  @Input() rows!: number; //Elementos por pagina 

  totalRecords!: number; //Numero total de libros
  currentPage: number = 1;
  first: number = 0; 

  books: any[] = []


  constructor(private bookService: BookService){}



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category'] && changes['category'].currentValue !== changes['category'].previousValue) {
      this.currentPage = 1;
      this.first = 0;
      this.loadBooks();
    }
  }

  loadBooks(): void {
    const filters = {
      category: this.category,
      page: this.currentPage,
      size: this.rows
   
    };

    this.bookService.getBooks(filters).subscribe({
      next: (response) => {   
        this.books = response.books;
        this.totalRecords = response.total_pages * this.rows; // Pa tener el numero total de registros/libros  
      },
      error: (error) => {
        console.error('Error al cargar los libros:', error);
      }
    });
  }


  onPaginateChange(event: any) {
    this.currentPage = event.page + 1; 
    this.first = event.first;
    this.loadBooks();
  }

  getLanguageEmoji(languageCode: string): string {
    const languageMap: any = {
      "inglés": 'language_us',
      "español": 'language_spanish'
    };

    return languageMap[languageCode.toLowerCase()] || 'question_mark'; // Default to question mark emoji if unknown
  }

  getState(state: boolean): string {
    return state ? 'Nuevo' : 'Usado';
  }

  getStateEmoji(state: boolean): string {
    const stateMap: any = {
      true: "bookmark_added",
      false: "bookmark_remove"
    }

    return stateMap[state.toString()] 
    
  }
}
