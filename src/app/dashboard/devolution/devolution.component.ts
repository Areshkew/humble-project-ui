import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '@services/user.service';
import { BookService } from '@services/book.service';
import { ToastService } from '@services/utils/toast.service';

@Component({
  selector: 'app-devolution',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './devolution.component.html',
  styleUrl: './devolution.component.css'
})

export class DevolutionComponent {
  imageUrl: string = environment.api_host;
  codeDevolution: string | null = null;
  librerias: string[] = []
  books: any
  selectedShop: string | null = null;

  constructor(private toastService: ToastService, private route: ActivatedRoute, private router: Router, private bookService: BookService, private userService: UserService) { }

  ngOnInit(): void {
    this.codeDevolution = this.route.snapshot.paramMap.get('code');
    if (this.codeDevolution) {
      this.informacionDevolucion()
      this.getTiendas()
    } else {
      this.router.navigate(['/inicio']);
    }
  }

  informacionDevolucion() {
    this.userService.obtenerInformacionDevolucion(this.codeDevolution).subscribe((books: any) => {
      let list_issn = books
      if (list_issn.length != 0) {
        this.bookService.getMultiplesBook(list_issn).subscribe(book => {
          this.books = book
        }, error => {
          console.error('Error al cargar la información de los libros', error);
        });
      }
    }, error => {
      this.toastService.showErrorToast("Error al buscar código para la devolución", "El código posiblemente ha caducado");
      this.router.navigate(['/inicio']);
    });
  }

  getTiendas() {
    this.bookService.obtenerTiendas().subscribe((shops: any) => {
      shops.forEach((shop: any) => {
        this.librerias.push(shop['nombre'])
        });      
    }, error => {
      console.error('Error al cargar la información de los libros', error);
    });
  }

  completarDevolucion(){
    this.userService.generarDevoluciones(this.codeDevolution, this.selectedShop).subscribe({
      next: (response) => {
        if (response.Success){
          this.toastService.showSuccessToast("Exito", "Devolución realizada");
          this.router.navigate(['/inicio']);
        } 
      },
      error: (error) => {
        this.toastService.showErrorToast("Error al realizar la devolución", error);
      }
    });
  }
}

