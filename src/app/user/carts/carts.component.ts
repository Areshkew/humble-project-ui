import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '@services/book.service';
import { environment } from '../../../environments/environment';
import { IconComponent } from '../../shared/icon/icon.component';
import { PaginatorModule } from 'primeng/paginator';
import { ToastService } from '@services/utils/toast.service';
import { RouterLink, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-carts',
  standalone: true,
  imports: [CommonModule, IconComponent, PaginatorModule, RouterLink, ButtonModule],
  templateUrl: './carts.component.html',
  styleUrl: './carts.component.css'
})
export class CartsComponent {
  imageUrl: string = environment.api_host;
  carrito: string[] = [];
  booksInformation: any;
  books: any;
  reservedBooks: any;
  reservedBooksInformation: any;
  reservedBooksShops: any;
  total: number = 0;
  listaISSN: string[] = [];
  personalInformation: any;
  shops: string[] = [];
  selectedShops: { [key: string]: string } = {};
  completed: boolean = false;
  userId: any = this.authService.getUserIdFromToken();
  showMenu: boolean = false;
  compras: [string, string][] = [];
  tiendasBorradas: number = 0;

  constructor(private bookService: BookService, private toastService: ToastService, private authService: AuthService,private router: Router,) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserIdFromToken();

    const carritoReservas = localStorage.getItem('carrito');
    if (carritoReservas) {
        this.carrito = JSON.parse(carritoReservas);
        this.getBooksInCart(this.carrito);
    }
    else{
      this.books = []
    }
    this.getReservations();
  }

  getBooksInCart(list_issn: string[]): void {
    if (list_issn.length > 0){
      this.bookService.getMultiplesBook(list_issn).subscribe(book => {
        this.books = book

        for (const book of this.books) {
          this.total = parseInt(book.descuento) + this.total
        }
        this.generateISSNList()
        this.getPersonalBookInfo()
      }, error => {
        console.error('Error al cargar la información de los libros', error);
      });
    }
    else{
      this.books = []
    }
  }

  generateISSNList() {
    this.books.forEach((libro: any) => {
      this.listaISSN.push(libro.ISSN);
    });
  }

  getPersonalBookInfo() {
    let listaISSNSinRepetidos = this.listaISSN.filter((item, index) => this.listaISSN.indexOf(item) === index);
    this.bookService.getMultiplePersonalBook(listaISSNSinRepetidos).subscribe(booksInformation => {
      this.personalInformation = booksInformation
    }, error => {
      console.error('Error al cargar la información de los libros', error);
    });
  }

  getReservations(){
    if (this.userId != null){
      this.bookService.getUserReservations(this.userId).subscribe(reserved => {
        let listaISSNtemporal: string[] = []
        reserved.forEach((bookReserved: any) => {
          listaISSNtemporal.push(bookReserved.id_libro);
        });

        this.getBooksReserved(listaISSNtemporal, reserved)
      }, error => {
        console.error('Error al cargar los libros reservados', error);
      });
    }
    else{
      this.reservedBooks = []
    }
  }

  getBooksReserved(list_issn: string[], reservedBooks2: any): void {
    this.bookService.getMultiplesBook(list_issn).subscribe(book => {
      let reservedBooksWithOutShop = book;
      let temporalBook: any

      this.reservedBooks = []

      for (const book of reservedBooksWithOutShop) {
        this.total = parseInt(book.descuento) + this.total
      }

      reservedBooks2.forEach((bookReserved: any) => {
        let found = false;
        reservedBooksWithOutShop.forEach((bookWithOutShop: any) =>{
          if (bookReserved.id_libro == bookWithOutShop.ISSN && !found){
            temporalBook = { ...bookWithOutShop };
            temporalBook['nombreTienda'] = bookReserved.nombre_tienda
            temporalBook['fechaFin'] = bookReserved.fecha_fin

            this.reservedBooks.push(temporalBook)
            found = true
          }
        });
        
      }); 
    }, error => {
      console.error('Error al cargar la información de los libros', error);
    });
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

  borrarLibroLocalStorage(ISSN: string) {
    for (let i = 0; this.books.length; i++) {
      if (this.books[i].ISSN === ISSN) {
        this.books.splice(i, 1);
        break;
      }
    }
    this.generateISSNList()
    this.tiendasBorradas++

    const indice = this.carrito.indexOf(ISSN);
    if (indice !== -1) {
      this.carrito.splice(indice, 1);
      localStorage.setItem('carrito', JSON.stringify(this.carrito)); // Actualizar el localStorage
    }
    location.reload();
  }

  allSelectionsMade() {
    let i = 0;
    this.books.forEach(()=>{
      i++
    });

    const selectedValues = Object.values(this.selectedShops);
    const uniqueValues = new Set(selectedValues);


    this.completed = ((Object.keys(this.selectedShops).length - this.tiendasBorradas == i) && (uniqueValues.size === selectedValues.length)) ;

    return (Object.keys(this.selectedShops).length - this.tiendasBorradas == i) && (uniqueValues.size === selectedValues.length)
  }

  solicitarReservar() {
    if (!this.userId){
      this.router.navigate(['/ingreso'])
    }

    let listSelectShops: string[] = [this.userId]

    for (const key in this.selectedShops) {
      listSelectShops.push(this.selectedShops[key]);
    }    
    if (this.completed) {
      this.bookService.realizarReservas(listSelectShops).subscribe({
        next: (r) => {
          if(r.success) this.toastService.showSuccessToast("Exito", "Se realizó la reserva correctamente.");
          localStorage.setItem('carrito', JSON.stringify([]));
          location.reload();
        },
        error: (error) => {
        this.toastService.showErrorToast("Error al realizar la reserva", error);
        }
      });
    }
  }

  desplegableCompra(){
    if (!this.userId){
      this.router.navigate(['/ingreso'])
    }
    this.showMenu = !this.showMenu; 
    
    this.compras = []
    this.books.forEach((libro: any) => {
      this.compras.push([libro.titulo, libro.descuento]);
    });

    this.reservedBooks.forEach((libro: any) => {
      this.compras.push([libro.titulo, libro.descuento]);
    });
  }

  volverse(){
    this.showMenu = !this.showMenu; 
  }

  cancelarReserva(ISSN: string, fecha: string, tienda: string){
    this.bookService.cancelarReservas(this.userId, ISSN, fecha, tienda).subscribe({
      next: (r) => {
        if(r.success) this.toastService.showSuccessToast("Exito", "Se canceló la reserva.");
        location.reload();
      },
      error: (error) => {
      this.toastService.showErrorToast("Error al realizar la reserva", error);
      }
    });
  }
}