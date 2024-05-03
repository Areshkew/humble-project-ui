import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule, ViewportScroller } from '@angular/common';
import { IconComponent } from '../../shared/icon/icon.component';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '@services/book.service';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css',
})
export class BookDetailsComponent {
  imageUrl: string = environment.api_host;
  book: any
  role: any

  constructor(private route: ActivatedRoute, private bookService: BookService, private viewportScroller: ViewportScroller, 
    private authService: AuthService,) {}

  ngOnInit(): void {
    this.role = this.authService.getUserRoleFromToken()
    this.route.params.subscribe(params => {
      const issn = params['issn'];
      if (issn) {
        this.loadBookDetails(issn);
        this.viewportScroller.scrollToPosition([0, 0])
      }
    });
  }

  loadBookDetails(issn: string): void {
    this.bookService.getBookByISSN(issn).subscribe(book => {
      this.book = book;
    }, error => {
      console.error('Error al cargar los detalles del libro:', error);
    });
  }

  getState(state: boolean): string {
    return state ? 'Nuevo' : 'Usado';
  }
}
