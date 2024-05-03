import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardShared } from '../../dashboard.shared';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { JsonService } from '@services/utils/json.service';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { GENRES } from '@models/genres';
import { User } from '@models/user.model';
import { ToastService } from '@services/utils/toast.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BookService } from '@services/book.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUpload, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [
    DashboardShared, InputTextModule, DropdownModule, ReactiveFormsModule,  CalendarModule, MultiSelectModule, FileUploadModule,
    InputTextareaModule
  ],
  templateUrl: './edit-book.component.html',
  styleUrl: './edit-book.component.css',
})
export class EditBookComponent implements OnInit {
  editInfoForm!: FormGroup;
  countries!: any;
  states!: any;
  cities!: any;
  minDate!: Date;
  bookGenres = GENRES;
  bookStatus = [
    "Nuevo",
    "Usado"
  ]
  ISSN!: string;
  book!: any;
  initialBookData: any = {};
  maxDate: Date = new Date();

  @ViewChild('stateDropdown') stateDropdownComponent!: Dropdown;
  @ViewChild('cityDropdown') cityDropdownComponent!: Dropdown;

  constructor(private formBuilder: FormBuilder, private jsonService: JsonService, private toastService: ToastService, private bookService: BookService,
              private ref: DynamicDialogRef, private config: DynamicDialogConfig) { }

  ngOnInit(){
    this.ISSN = this.config.data.ISSN;

    this.editInfoForm = this.formBuilder.group({
      'ISSN': ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      'titulo': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      'autor': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      'resenia': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1500)]],
      'num_paginas': ['', [Validators.required, Validators.min(1)]],
      'idioma': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]],
      'fecha_publicacion': ['', [Validators.required]],  
      'estado': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      'portada': [null],
      'precio': ['', [Validators.required, Validators.min(0)]],
      'descuento': [null, [Validators.min(0)]],
      'editorial': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      'genero': ['', [Validators.required]] 
    });
    
    this.bookService.getBook(this.ISSN).subscribe((b) => {
      this.book = b;
      const genero = GENRES.filter(genero => b.genero.includes(genero.genero));

      this.initialBookData = b;
      this.initialBookData.genero = genero[0];
      this.initialBookData.estado = (b.estado ? 'Nuevo' : 'Usado');
      
      this.editInfoForm.patchValue({
        ISSN: b.ISSN,
        autor: b.autor,
        descuento: b.descuento,
        editorial: b.editorial,
        estado: (b.estado ? 'Nuevo' : 'Usado'),
        fecha_publicacion: this.convertToLocalDate(b.fecha_publicacion),
        genero: genero[0],
        idioma: b.idioma,
        num_paginas: b.num_paginas,
        precio: b.precio,
        resenia: b.resenia,
        titulo: b.titulo
      })
    })
  }

  uploadFile(event: FileUploadHandlerEvent) {
      const file = event.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
              const base64 = e.target.result as string;
              this.editInfoForm.get('portada')?.patchValue(base64);
              this.editInfoForm.get('portada')?.updateValueAndValidity();
          };
          reader.readAsDataURL(file);
      }
  }

  onSubmit(){
    if(this.editInfoForm.invalid){
      Object.keys(this.editInfoForm.controls).forEach(field => {
        const control = this.editInfoForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      
      return;
    }

    const formData: User = Object.assign({}, this.editInfoForm.value);

    const changedData = this.getChangedData(formData);

    // this.rootService.editAdmin(this.ISSN, changedData).subscribe({
    //   next: (r) => {
    //     if(r.success) this.toastService.showSuccessToast("Exito", "Se actualizaron los detalles de la cuenta.")
    //   },
    //   error: (error) => {
    //     this.toastService.showErrorToast("Error", error);
    //   }
    // });
  }

  private convertToLocalDate(dateString: string) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getChangedData(formData: any) {
    const changedData: any = {};

    Object.keys(formData).forEach(key => {
      // Check if the data is different from the initial data
      if (formData[key] !== this.initialBookData[key]) {

        if (key === 'fecha_publicacion' && formData[key] instanceof Date) {
          const date = formData[key] as Date;
          const formattedDate = this.formatDateToYYYYMMDD(date);

          if(formattedDate !== this.initialBookData[key]) changedData[key] = formattedDate;
        } else {
          changedData[key] = formData[key];
        }
      }
    });
    return changedData;
  }

}