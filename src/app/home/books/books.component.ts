import { Component, OnInit, Input, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IconComponent } from '../../shared/icon/icon.component';
import { CommonModule, ViewportScroller } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { BookService } from '@services/book.service';
import { ToastService } from '@services/utils/toast.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [IconComponent, CommonModule, PaginatorModule, RouterLink],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnChanges{
  imageUrl: string = environment.api_host;
  public iconSize: number = 22

  @Input() filters: any;

  totalRecords!: number; 
  currentPage: number = 1;
  first: number = 0; 

  books: any[] = []
  role: any


  constructor(private bookService: BookService, private viewportScroller: ViewportScroller, private toastService: ToastService,
    private authService: AuthService
  ){this.adjustIconSize();}

  ngOnChanges(changes: SimpleChanges): void {
    this.role = this.authService.getUserRoleFromToken()
    this.viewportScroller.scrollToPosition([0, 0])
    
    
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
        this.totalRecords = response.total_pages * this.filters.size;
      },
      error: (error) => {
        console.error('Error al cargar libros:', error);
        this.toastService.showErrorToast("Error al cargar libros", error.message);
      }
    });
  }

  

  onPaginateChange(event: any) {
    this.filters.page = event.page + 1; 
    this.first = event.first;
    this.viewportScroller.scrollToPosition([0, 0])
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

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.adjustIconSize();
  }

  private adjustIconSize() {
    if (window.innerWidth < 768) { 
      this.iconSize = 16; 
    } else {
      this.iconSize = 22; 
    }
  }
}
