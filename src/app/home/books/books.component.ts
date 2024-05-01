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

  @Input() filters: any;

  totalRecords!: number; 
  currentPage: number = 1;
  first: number = 0; 

  books: any[] = []


  constructor(private bookService: BookService){}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Datos que llegan al books',this.filters);
    
    if (changes['filters'] && changes['filters'].currentValue !== changes['filters'].previousValue) {
      this.filters.page = 1;
      this.first = 0;
      this.loadBooks();
    }
  }

  loadBooks(): void {

    this.bookService.getBooks(this.filters).subscribe({
      next: (response) => {   
        this.books = response.books;
        this.totalRecords = response.total_pages * this.filters.size; // Pa tener el numero total de registros/libros  
      },
      error: (error) => {
        console.error('Error al cargar los libros:', error);
      }
    });
  }


  onPaginateChange(event: any) {
    this.filters.page = event.page + 1; 
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
