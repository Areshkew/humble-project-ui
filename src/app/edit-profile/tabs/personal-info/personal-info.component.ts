import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { JsonService } from '@services/json.service';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { GENRES } from '@models/genres';
import { CommonModule } from '@angular/common';
import { UserService } from '@services/auth/user.service';
import { User } from '@models/user.model';
import { ToastService } from '@services/toast.service';
@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule ,InputTextModule, DropdownModule, ReactiveFormsModule,  CalendarModule, MultiSelectModule],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent implements OnInit{

  editInfoForm!: FormGroup;
  editPassword!: FormGroup;
  countries!: any;
  states!: any;
  cities!: any;
  maxDate!: Date;
  minDate!: Date;
  bookGenres = GENRES;

  genres = [
    "Femenino",
    "Masculino",
    "Ruiz",
    "Otro"
  ]

  @ViewChild('stateDropdown') stateDropdownComponent!: Dropdown;
  @ViewChild('cityDropdown') cityDropdownComponent!: Dropdown;

  constructor(private formBuilder: FormBuilder, private jsonService: JsonService, private userService: UserService, private toastService: ToastService) {
    
  }

  ngOnInit(){
    this.editInfoForm = this.formBuilder.group({
      'DNI': ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
      'nombre': ['', [Validators.required, Validators.maxLength(32)]],
      'apellido': ['', [Validators.required, Validators.maxLength(32)]],
      'fecha_nacimiento': ['', [Validators.required]],
      'ciudad': ['', [Validators.required]],
      'estado': ['', [Validators.required]],
      'pais': ['', [Validators.required]],
      'direccion_envio': ['', [Validators.required, Validators.maxLength(64)]],
      'genero': ['', [Validators.required]],
      'correo_electronico': ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(32)]],
      'usuario': ['', [Validators.required, Validators.maxLength(32)]],
      'preferencias': ['', [Validators.required]],
    });

    this.editPassword = this.formBuilder.group({
      'clave': ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)]],
      'nueva-clave': ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)]],
      'confirmar-clave': ['', [Validators.required]],
    })

    this.jsonService.fetchJson("countries+states+cities").subscribe(_countries => {
      this.countries = _countries;
    })

    this.maxDate = new Date();
    const maxBirthYear = this.maxDate.getFullYear() - 18;
    this.maxDate.setFullYear(maxBirthYear);

    this.minDate = new Date();
    const minBirtYear = this.minDate.getFullYear() - 101;
    this.minDate.setFullYear(minBirtYear);

    
  }

  onCountryChange(){
    const selectedCountry = this.editInfoForm.get('pais')?.value;

    console.log(selectedCountry);
    

    if(this.cityDropdownComponent && this.stateDropdownComponent) {
      this.cityDropdownComponent.clear();
      this.stateDropdownComponent.clear();
    }

    if(!selectedCountry) return;

    this.states = selectedCountry.states.length > 0 ? selectedCountry.states : [{name: selectedCountry.name, cities: []}];
  }


  onStateChange(){
    const selectedCountry = this.editInfoForm.get('pais')?.value;
    const selectedState = this.editInfoForm.get('estado')?.value;

    if(this.cityDropdownComponent) this.cityDropdownComponent.clear();
    if(!selectedState) return;

    this.cities = selectedState.cities.length > 0 ? selectedState.cities : [{name: selectedCountry.name}];
  }


  onSubmit(){
    if(this.editInfoForm.invalid){
      Object.keys(this.editInfoForm.controls).forEach(field => {
        const control = this.editInfoForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      
      return;
    }
    const country = this.editInfoForm.get('pais')?.value.name;
    const state = this.editInfoForm.get('estado')?.value.name;
    const city = this.editInfoForm.get('ciudad')?.value.name;
    const formData: User = Object.assign({}, this.editInfoForm.value);

    formData.DNI = formData.DNI.toString();
    formData.pais = country;
    formData.estado = state;
    formData.ciudad = city;

    console.log(formData);
    

    this.userService.editPersonalInfo(formData).subscribe({
      error: (error) => {
        this.toastService.showErrorToast("Error", error);
      }
    });

  }

  onSubmitPass(){
    if(this.editPassword.invalid){
      Object.keys(this.editPassword.controls).forEach(field => {
        const control = this.editPassword.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      
      return;
    }

    console.log(this.editPassword.value);
    

    if(this.editPassword.get('nueva-clave')?.value === this.editPassword.get('confirmar-clave')?.value) {
      
        this.userService.editPassword(this.editPassword.value).subscribe({
          
          error: (error) => {
            this.toastService.showErrorToast("Error", error)
          }
        })
      }
      
    }

}

