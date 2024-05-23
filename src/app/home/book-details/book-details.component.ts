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
import { ToastService } from '@services/utils/toast.service';
import { Router } from '@angular/router';

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
  bookAmountAndUbication: any
  role: any
  ref: DynamicDialogRef | undefined;
  success: boolean = false

  carrito: string[] = [];

  constructor(private route: ActivatedRoute, private bookService: BookService, private viewportScroller: ViewportScroller, 
    private authService: AuthService, private dialogService: DialogService, private router: Router, private toastService: ToastService) {}

  ngOnInit(): void {
    this.role = this.authService.getUserRoleFromToken()
    this.route.params.subscribe(params => {
      const issn = params['issn'];
      if (issn) {
        this.loadBookDetails(issn);
        this.loadPersonalBookDetails(issn);
        this.viewportScroller.scrollToPosition([0, 0])
      }
    });
  
    const carritoReservas = localStorage.getItem('carrito');
    if (carritoReservas) {
      this.carrito = JSON.parse(carritoReservas);
    }
    else{
      this.carrito = []
    }
  }

  loadBookDetails(issn: string): void {
    this.bookService.getBook(issn).subscribe(book => {
      this.book = book;
    }, error => {
      console.error('Error al cargar los detalles del libro:', error);
    });
  }

  loadPersonalBookDetails(issn: string): void{
    this.bookService.getPersonalBook(issn).subscribe(book => {
      this.bookAmountAndUbication = book;
    }, error => {
      console.error('Error al cargar la información de los libros', error);
    });
  }

  editBook(ISSN: string): void {
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

  anadirLibroAlCarrito(ISSN: string){
    if(this.bookAmountAndUbication == null){
      this.toastService.showErrorToast("No se puede reservar este libro", "No existen ejemplares de este libro");
    }
    else{
      var cantidadRepetido = 0
      var cantidadDisponible = 0

      this.bookAmountAndUbication.forEach((item: any) =>{
        cantidadDisponible = item.cantidad + cantidadDisponible;
      })
      if(cantidadDisponible < 1){
        this.toastService.showErrorToast("No se puede reservar este libro", "No existen ejemplares disponibles de este libro");
      }
      else{
        if(this.carrito.length < 5){
          for(var i = 0; i<this.carrito.length; i++){
            if(this.carrito[i] == ISSN){
              cantidadRepetido += 1
            }
          }
          if (cantidadRepetido > 2){
            this.toastService.showErrorToast("No se puede reservar este libro", "Se puede almacenar un máximo de 3 ejemplares de este libro");
          }
          else{
            this.carrito.push(ISSN);
            this.actualizarLocalStorage();
            this.success = true;
            setTimeout(() => {
              this.success = false; // Desactiva la clase fade-out después de 5 segundos
          }, 4000)
          }
  
        }
        else{
          this.toastService.showErrorToast("No se puede reservar este libro","El carrito está lleno");
        }
      }
    }
  }

  private actualizarLocalStorage(): void {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }
}
