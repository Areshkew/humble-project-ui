import {  Component, OnInit, ViewChild } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { GENRES } from '@models/genres';
import { JsonService } from '@services/utils/json.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@models/user.model';
import { ToastService } from '@services/utils/toast.service';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DashboardShared } from '../../dashboard.shared';
import { RootService } from '@services/root.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { NormalizeSpacesDirective } from '../../../shared/directives/normalizeSpace.directive';

@Component({
  selector: 'app-create-admin',
  standalone: true,
  imports: [
    DashboardShared, NormalizeSpacesDirective,
    CalendarModule, InputTextModule, MultiSelectModule, DropdownModule, InputSwitchModule
  ],
  templateUrl: './create-admin.component.html',
  styleUrl: './create-admin.component.css',
})
export class CreateAdminComponent implements OnInit{
  bookGenres = GENRES;
  genres = [
    "Femenino",
    "Masculino",
    "Ruiz",
    "Otro"
  ]
  roads = [
    "Avenida",
    "Calle",
    "Carrera",
    "Circular",
    "Circunvalar",
    "Diagonal",
    "Manzana",
    "Transversal",
    "Vía"
  ]
  maxDate!: Date;
  minDate!: Date;
  countries!: any;
  states!: any;
  cities!: any;
  createAdminForm!: FormGroup;


  @ViewChild('stateDropdown') stateDropdownComponent!: Dropdown;
  @ViewChild('cityDropdown') cityDropdownComponent!: Dropdown;

  constructor(private jsonService: JsonService, private formBuilder: FormBuilder, private rootService: RootService, private toastService: ToastService,
    private ref: DynamicDialogRef
  ){}

  ngOnInit(){


    this.createAdminForm = this.formBuilder.group({
      'DNI': ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]+$')]],
      'nombre': ['', [Validators.required, Validators.maxLength(32), Validators.pattern('^[a-zA-Z" "]+$')]],
      'apellido': ['', [Validators.required, Validators.maxLength(32), Validators.pattern('^[a-zA-Z" "]+$')]],
      'fecha_nacimiento': ['', [Validators.required]],
      'ciudad': ['', [Validators.required]],
      'estado': ['', [Validators.required]],
      'pais': ['', [Validators.required]],
      'direccion_envio': this.formBuilder.group({
        'tipo_via': ['', Validators.required],
        'nombre_via': ['', [Validators.required, Validators.maxLength(42), Validators.pattern('^[a-zA-Z0-9" "#-]+$')]],
        'numero_exterior': ['', Validators.required, Validators.maxLength(4)],
        'numero_interior': ['', Validators.required, Validators.maxLength(4)]
      }),
      'genero': ['', [Validators.required]],
      'correo_electronico': ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(32), Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ]],
      'usuario': ['', [Validators.required, Validators.maxLength(32), Validators.pattern('^[a-zA-Z0-9_.]+$')]],
      'clave': ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32), Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})/)]],
    });


    // Limites de fecha
    this.maxDate = new Date();
    const maxBirthYear = this.maxDate.getFullYear() - 18;
    this.maxDate.setFullYear(maxBirthYear);

    this.minDate = new Date();
    const minBirtYear = this.minDate.getFullYear() - 101;
    this.minDate.setFullYear(minBirtYear);

    // 
    this.jsonService.fetchJson("countries+states+cities").subscribe(_countries => {
      this.countries = _countries;
    })
  }

  onCountryChange(){
    const selectedCountry = this.createAdminForm.get('pais')?.value;

    if(this.cityDropdownComponent && this.stateDropdownComponent) {
      this.cityDropdownComponent.clear();
      this.stateDropdownComponent.clear();
    }

    if(!selectedCountry) return;

    this.states = selectedCountry.states.length > 0 ? selectedCountry.states : [{name: selectedCountry.name, cities: []}];
  }

  onStateChange(){
    const selectedCountry = this.createAdminForm.get('pais')?.value;
    const selectedState = this.createAdminForm.get('estado')?.value;

    if(this.cityDropdownComponent) this.cityDropdownComponent.clear();
    if(!selectedState) return;

    this.cities = selectedState.cities.length > 0 ? selectedState.cities : [{name: selectedCountry.name}];
  }

  onSubmit(){
    if(this.createAdminForm.valid){
      // Mark FormControls as Touched
      Object.keys(this.createAdminForm.controls).forEach(field => {
        const control = this.createAdminForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      
      return;
    }
    const country = this.createAdminForm.get('pais')?.value.name;
    const state = this.createAdminForm.get('estado')?.value.name;
    const city = this.createAdminForm.get('ciudad')?.value.name;

    const formAddress = this.createAdminForm.get('direccion_envio') as FormGroup;
    const typeRoad = formAddress.get('tipo_via')?.value;
    const nameRoad = formAddress.get('nombre_via')?.value;
    const outNumber = formAddress.get('numero_exterior')?.value;
    const inNumber = formAddress.get('numero_interior')?.value;
    const completeAddress = `${nameRoad} ${typeRoad} ${outNumber} ${inNumber}`;

    const formData: User = Object.assign({}, this.createAdminForm.value); // Deep copy 

    // Transformar los datos
    formData.DNI = formData.DNI.toString();
    formData.pais = country;
    formData.estado = state;
    formData.ciudad = city;
    formData.direccion_envio = completeAddress;  
    
    this.rootService.createAdmin(formData).subscribe({
      next: (response) => {
        this.toastService.showSuccessToast("Creación de Admin", "Se ha creado una nueva cuenta de administrador.");
        this.ref.close()
      },
      error: (error) => {
        this.toastService.showErrorToast("Error", error);
      }
    });
  }
  
}
