import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardShared } from '../dashboard.shared';
import { ConfirmationService,  MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastService } from '@services/utils/toast.service';
import { Subscription } from 'rxjs';
import { TableLazyLoadEvent } from 'primeng/table';
import { BookService } from '@services/book.service';
import { CreateBookComponent } from './create-book/create-book.component';
import { EditBookComponent } from './edit-book/edit-book.component';
import { AddUnitsComponent } from './add-units/add-units.component';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    DashboardShared,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
  providers: [DialogService]
})
export class BooksComponent implements OnInit, OnDestroy{ 
  books!: any;
  bookSuscription!: Subscription;
  selectedBooks!: any;
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  ref: DynamicDialogRef | undefined;
  totalPages!: number;


  constructor(private confirmationService: ConfirmationService, public dialogService: DialogService, private bookService: BookService, private toastService: ToastService)  {}

  ngOnInit(): void {
    this.items = [{ label: 'Libros' }];
    this.home = { icon: 'pi pi-home', routerLink: '/panel-book' };

    this.fetchBooks(1);
  }

  ngOnDestroy(): void {
      if(this.bookSuscription) this.bookSuscription.unsubscribe();
  }

  show() {
    this.ref = this.dialogService.open(CreateBookComponent, { header: 'Agregar un Libro' });

    this.ref.onClose.subscribe(() => {
      this.fetchBooks(1);
    })
  }

  // ---
  loadData(event: TableLazyLoadEvent){
    if(event && event.first && event.rows){
      const currentPage = event.first / event.rows + 1;

      this.fetchBooks(currentPage);
    }else this.fetchBooks(1);
  }

  fetchBooks(page: number){
    if(this.bookSuscription) this.bookSuscription.unsubscribe();
    const PAGE_SIZE = 8;

    this.bookSuscription = this.bookService.getBooks({ size: PAGE_SIZE, page: page }).subscribe({
      next: books => {
        this.books = books.books;
        this.totalPages = books.total_pages * PAGE_SIZE;
      },
      error: (e) => {
        this.books = []
        this.selectedBooks = []
        this.toastService.showErrorToast("Error", e);
      }
    })
  }

  editBook(ISSN: string){
    this.ref = this.dialogService.open(EditBookComponent, { 
      header: `Editando libro con ISSN: ${ISSN}.`,
      data: {
        ISSN: ISSN
      }
    });

    this.ref.onClose.subscribe(() => {
      this.fetchBooks(1);
    })
  }

  addUnits(ISSN: string){ 
    this.ref = this.dialogService.open(AddUnitsComponent, { 
      header: `Editando unidades por tienda, libro con ISSN: ${ISSN}.`,
      data: {
        ISSN: ISSN
      }
    });
  }


  confirm_single_delete(event: Event, ISSN: string) {
    this.confirmationService.confirm({
        target: (event.target ? event.target : undefined),
        message: 'Estás seguro de realizar esta acción?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "Si",
        accept: () => {
          const deletedISSN = [ISSN];

          this.bookService.deleteBooks({ issn_list: deletedISSN }).subscribe({
            next: (response) => {
              this.toastService.showInfoToast("Borrado de Libro", `Se ha eliminado el libro con ISSN ${ISSN}.`);
              this.fetchBooks(1);
              this.selectedBooks = []
            },
            error: (error) => {
              this.toastService.showErrorToast("Error", error);
            }
          })
        }
    });
  }
  
  confirm_multiple_delete(event: Event) {
    this.confirmationService.confirm({
        target: (event.target ? event.target : undefined),
        message: 'Estás seguro de realizar esta acción?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "Si",
        accept: () => {
          const deletedISSN = this.selectedBooks.map((book: any) => { return book.ISSN });

          this.bookService.deleteBooks({ issn_list: deletedISSN } ).subscribe({
            next: (response) => {
              this.toastService.showInfoToast("Borrado de Libro", "Se han eliminado multiples libros.");
              this.fetchBooks(1);
              this.selectedBooks = []
            },
            error: (error) => {
              this.toastService.showErrorToast("Error", error)
            }
          })
        }
    });
  }
}

