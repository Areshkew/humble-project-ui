import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule, ViewportScroller } from '@angular/common';
import { IconComponent } from '../../shared/icon/icon.component';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '@services/book.service';
import { AuthService } from '@services/auth/auth.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { EditBookComponent } from '../../dashboard/books/edit-book/edit-book.component';


@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, IconComponent],
  providers: [
    DialogService
  ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css',
})
export class BookDetailsComponent {
  imageUrl: string = environment.api_host;
  book: any
  role: any
  ref: DynamicDialogRef | undefined;

  constructor(private route: ActivatedRoute, private bookService: BookService, private viewportScroller: ViewportScroller, 
    private authService: AuthService, private dialogService: DialogService) {}

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
    this.bookService.getBook(issn).subscribe(book => {
      this.book = book;
    }, error => {
      console.error('Error al cargar los detalles del libro:', error);
    });
  }

  editBook(ISSN: string): void {
    console.log("hi");
    
    this.ref = this.dialogService.open(EditBookComponent, { 
      header: `Editando libro con ISSN: ${ISSN}`,
      data: {
        ISSN: ISSN
      }
    });

    this.ref.onClose.subscribe(() => {
      
      this.loadBookDetails(ISSN); // Por ejemplo, recargar los detalles del libro
    });
  }

  getState(state: boolean): string {
    return state ? 'Nuevo' : 'Usado';
  }
}
