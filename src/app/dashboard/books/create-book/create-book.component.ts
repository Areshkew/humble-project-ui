import {  Component, OnInit, ViewChild } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUpload, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { GENRES } from '@models/genres';
import { JsonService } from '@services/utils/json.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '@services/utils/toast.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DashboardShared } from '../../dashboard.shared';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { NormalizeSpacesDirective } from '../../../shared/directives/normalizeSpace.directive';
import { BookService } from '@services/book.service';

@Component({
  selector: 'app-create-book',
  standalone: true,
  imports: [
    DashboardShared, NormalizeSpacesDirective, InputTextareaModule, FileUploadModule,
    CalendarModule, InputTextModule, MultiSelectModule, DropdownModule, InputSwitchModule
  ],
  templateUrl: './create-book.component.html',
  styleUrl: './create-book.component.css',
})
export class CreateBookComponent implements OnInit{
  bookGenres = GENRES;
  bookStatus = [
    "Nuevo",
    "Usado"
  ]
  createbookForm!: FormGroup;
  maxDate: Date = new Date();

  @ViewChild('fileUpload') coverUpload!: FileUpload;

  constructor(private jsonService: JsonService, private formBuilder: FormBuilder, private bookService: BookService, private toastService: ToastService,
    private ref: DynamicDialogRef
  ){}

  ngOnInit(){
    this.createbookForm = this.formBuilder.group({
      'ISSN': ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      'titulo': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      'autor': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      'resenia': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(1500)]],
      'num_paginas': ['', [Validators.required, Validators.min(1)]],
      'idioma': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]],
      'fecha_publicacion': ['', [Validators.required]],  
      'estado': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      'portada': ['', [Validators.required]],
      'precio': ['', [Validators.required, Validators.min(0)]],
      'descuento': [null, [Validators.min(0)]],
      'editorial': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      'genero': ['', [Validators.required]] 
    });
    
  }

  uploadFile(event: FileUploadHandlerEvent) {
    const file = event.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const base64 = e.target.result as string;
            this.createbookForm.get('portada')?.patchValue(base64);
            this.createbookForm.get('portada')?.updateValueAndValidity();
        };
        reader.readAsDataURL(file);
    }
}

  onSubmit(){
    if(this.createbookForm.invalid){
      // Mark FormControls as Touched
      Object.keys(this.createbookForm.controls).forEach(field => {
        const control = this.createbookForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      
      return;
    }
    const genero = this.createbookForm.get('genero')?.value.id;
    const estado = this.createbookForm.get('genero')?.value == "Nuevo" ? 'True' : 'False';

    const formData = Object.assign({}, this.createbookForm.value); // Deep copy 

    formData.genero = genero;
    formData.estado = estado;
    
    this.bookService.createBook(formData).subscribe({
      next: (response) => {
        this.toastService.showSuccessToast("Creación de book", "Se ha creado una nuevo libro.");
        this.ref.close()
      },
      error: (error) => {
        this.toastService.showErrorToast("Error", error);
      }
    });
  }
  
}

