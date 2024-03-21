import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { JsonService } from '@services/json.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '@models/user.model';
import { UserService } from '../../services/auth/user.service';
import { CookieService } from '@services/cookie.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-modify-users',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule, ReactiveFormsModule,
    CalendarModule, InputTextModule, MultiSelectModule, DropdownModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './modify-users.component.html',
  styleUrl: './modify-users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModifyUsersComponent implements OnInit{ 
  genres = [
    "Femenino",
    "Masculino",
    "Ruiz",
    "Otro"
  ]
  maxDate!: Date;
  minDate!: Date;
  countries!: any;
  states!: any;
  cities!: any;
  registerForm!: FormGroup;

  @ViewChild('stateDropdown') stateDropdownComponent!: Dropdown;
  @ViewChild('cityDropdown') cityDropdownComponent!: Dropdown;

  constructor(private jsonService: JsonService, private formBuilder: FormBuilder, 
              private userService: UserService, private cookieService: CookieService,
              private router: Router, private messageService: MessageService,
              private route: ActivatedRoute){}

  textoBoton = "";
  userDNI = "";

  ngOnInit(){
    //Obtiene el id de la ruta y hace una consulta en la Base de Datos para rellenar los datos
     

    this.route.params.subscribe(params => {
      this.userDNI = params['dni'];
    });

    if (this.userDNI == "nuevo"){
      this.textoBoton = "Guardar nuevo admin";

      this.registerForm = this.formBuilder.group({
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
        'clave': ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)]]
      });
    }
    else{
      this.textoBoton = "Editar información usuario";

        //Esta es la mejor imitación de consulta de base de datos de la historia
        var usuarioEjemplo = "ejemplo_usuario";
        var correoEjemplo = "ejemplo@correo.com";
        var nombreEjemplo = "Juan";
        var apellidosEjemplo = "Pérez";
        var fechaNacimiento = "16/02/2020";
        var direccionEjemplo = "Calle Ejemplo, 123";
        var contrasenaEjemplo = "contrasena123";
        var generoEjemplo = "Ruiz";
        var paisEjemplo = "Albania";
        var estadoEjemplo = "Buenos Aires";
        var ciudadEjemplo = "Ciudad Autónoma de Buenos Aires";

      this.registerForm = this.formBuilder.group({
        'DNI': [this.userDNI, [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
        'nombre': [nombreEjemplo, [Validators.required, Validators.maxLength(32)]],
        'apellido': [apellidosEjemplo, [Validators.required, Validators.maxLength(32)]],
        'fecha_nacimiento': [fechaNacimiento, [Validators.required]],
        'ciudad': [ciudadEjemplo, [Validators.required]],
        'estado': [estadoEjemplo, [Validators.required]],
        'pais': [paisEjemplo, [Validators.required]],
        'direccion_envio': [direccionEjemplo, [Validators.required, Validators.maxLength(64)]],
        'genero': [generoEjemplo, [Validators.required]],
        'correo_electronico': [correoEjemplo, [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(32)]],
        'usuario': [usuarioEjemplo, [Validators.required, Validators.maxLength(32)]],
        'clave': [contrasenaEjemplo, [Validators.required, Validators.minLength(5), Validators.maxLength(32), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/)]]
      });
    }
    
    

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
    const formData: User = Object.assign({}, this.registerForm.value); // Deep copy 

    // Transformar los datos
    formData.DNI = formData.DNI.toString();
    formData.pais = country;
    formData.estado = state;
    formData.ciudad = city;

    
    if (this.userDNI == "nuevo"){

      //Registra un nuevo usuario
      this.userService.register(formData).subscribe({
        next: () => {
          this.router.navigate(['/root/dashboard/admin-users']);
        },
        error: (error) => {
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: error });
        }
      });
    }
    
    else{
      //Actualiza a un usuario
      this.userService.updateUser(formData).subscribe({
        next: () => {
          this.router.navigate(['/root/dashboard/admin-users']);
        },
        error: (error) => {
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: error });
        }
      });
  
    }

  }
  
}
