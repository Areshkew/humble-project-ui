import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { GENRES } from '@models/genres';
import { JsonService } from '@services/json.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@models/user.model';
import { UserService } from '../../services/auth/user.service';
import { CookieService } from '@services/cookie.service';
import { MessageService } from 'primeng/api';
import { AuthShared } from '../auth.shared';
import { ToastService } from '@services/toast.service';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    AuthShared,
    CalendarModule, InputTextModule, MultiSelectModule, DropdownModule, InputSwitchModule
  ],
  providers: [MessageService],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent implements OnInit{ 
  bookGenres = GENRES;
  genres = [
    "Femenino",
    "Masculino",
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
  registerForm!: FormGroup;

  @ViewChild('stateDropdown') stateDropdownComponent!: Dropdown;
  @ViewChild('cityDropdown') cityDropdownComponent!: Dropdown;

  constructor(private jsonService: JsonService, private formBuilder: FormBuilder, private userService: UserService, 
              private cookieService: CookieService, private router: Router, private toastService: ToastService){}
    

  ngOnInit(){
    this.registerForm = this.formBuilder.group({
      'DNI': ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]+$')]],
      'nombre': ['', [Validators.required, Validators.maxLength(32), Validators.pattern('^[a-zA-Z" "]+$')]],
      'apellido': ['', [Validators.required, Validators.maxLength(32), Validators.pattern('^[a-zA-Z" "]+$')]],
      'fecha_nacimiento': ['', [Validators.required]],
      'ciudad': ['', [Validators.required]],
      'estado': ['', [Validators.required]],
      'pais': ['', [Validators.required]],
      'direccion_envio': this.formBuilder.group({
        'tipo_via': ['', Validators.required, ],
        'nombre_via': ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9" "#-]+$')]],
        'numero_exterior': ['', Validators.required],
        'numero_interior': ['', Validators.required]
      }),
      'genero': ['', [Validators.required]],
      'correo_electronico': ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(32), Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ]],
      'usuario': ['', [Validators.required, Validators.maxLength(32), Validators.pattern('^[a-zA-Z0-9_.]+$')]],
      'clave': ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})/)]],
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
    const selectedCountry = this.registerForm.get('pais')?.value;

    if(this.cityDropdownComponent && this.stateDropdownComponent) {
      this.cityDropdownComponent.clear();
      this.stateDropdownComponent.clear();
    }

    if(!selectedCountry) return;

    this.states = selectedCountry.states.length > 0 ? selectedCountry.states : [{name: selectedCountry.name, cities: []}];
  }

  onStateChange(){
    const selectedCountry = this.registerForm.get('pais')?.value;
    const selectedState = this.registerForm.get('estado')?.value;

    if(this.cityDropdownComponent) this.cityDropdownComponent.clear();
    if(!selectedState) return;

    this.cities = selectedState.cities.length > 0 ? selectedState.cities : [{name: selectedCountry.name}];
  }

  onSubmit(){
    if(this.registerForm.invalid){
      // Mark FormControls as Touched
      Object.keys(this.registerForm.controls).forEach(field => {
        const control = this.registerForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      
      return;
    }
    const country = this.registerForm.get('pais')?.value.name;
    const state = this.registerForm.get('estado')?.value.name;
    const city = this.registerForm.get('ciudad')?.value.name;

    const formAddress = this.registerForm.get('direccion_envio') as FormGroup;
    const typeRoad = formAddress.get('tipo_via')?.value;
    const nameRoad = formAddress.get('nombre_via')?.value;
    const outNumber = formAddress.get('numero_exterior')?.value;
    const inNumber = formAddress.get('numero_interior')?.value;
    const completeAddress = `${nameRoad} ${typeRoad} ${outNumber} ${inNumber}`;

    const formData: User = Object.assign({}, this.registerForm.value); // Deep copy 

    // Transformar los datos
    formData.DNI = formData.DNI.toString();
    formData.pais = country;
    formData.estado = state;
    formData.ciudad = city;
    formData.direccion_envio = completeAddress;  
    
    this.userService.register(formData).subscribe({
      next: (response) => {
        if (response.token) {
          this.toastService.showSuccessToast("Registro Exitoso", "Te damos la bienvenida a LibHub")
          this.cookieService.setCookie("Bearer", response.token, 1);
          this.router.navigate(['/inicio']);
        } else {
          console.error('No se encontro el token en la respuesta del servidor.');
        }
      },
      error: (error) => {
        this.toastService.showErrorToast("Error", error);
      }
    });

  }
  
}