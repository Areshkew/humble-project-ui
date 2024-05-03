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
import { RootService } from '@services/root.service';

@Component({
  selector: 'app-edit-admin',
  standalone: true,
  imports: [
    DashboardShared, InputTextModule, DropdownModule, ReactiveFormsModule,  CalendarModule, MultiSelectModule
  ],
  templateUrl: './edit-admin.component.html',
  styleUrl: './edit-admin.component.css',
})
export class EditAdminComponent implements OnInit {
  editInfoForm!: FormGroup;
  editPassword!: FormGroup;
  countries!: any;
  states!: any;
  cities!: any;
  maxDate!: Date;
  minDate!: Date;
  bookGenres = GENRES;
  DNI!: string;
  user: string[] = [
    "DNI",
    "nombre",
    "apellido",
    "fecha_nacimiento",
    "pais",
    "estado",
    "ciudad",
    "direccion_envio",
    "genero",
    "correo_electronico",
    "usuario",  
    "preferencias"
  ];
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
  initialUserData: any = {}

  @ViewChild('stateDropdown') stateDropdownComponent!: Dropdown;
  @ViewChild('cityDropdown') cityDropdownComponent!: Dropdown;

  constructor(private formBuilder: FormBuilder, private jsonService: JsonService, private toastService: ToastService, private rootService: RootService,
              private ref: DynamicDialogRef, private config: DynamicDialogConfig) { }

  ngOnInit(){
    this.DNI = this.config.data.DNI;

    this.editInfoForm = this.formBuilder.group({
      'nombre': ['', [Validators.required, Validators.maxLength(32)]],
      'apellido': ['', [Validators.required, Validators.maxLength(32)]],
      'fecha_nacimiento': ['', [Validators.required]],
      'ciudad': ['', [Validators.required]],
      'estado': ['', [Validators.required]],
      'pais': ['', [Validators.required]],
      'direccion_envio': this.formBuilder.group({
        'tipo_via': ['', Validators.required],
        'nombre_via': ['', Validators.required],
        'numero_exterior': ['', Validators.required,],
        'numero_interior': ['', Validators.required,]
      }),
      'genero': ['', [Validators.required]],
      'preferencias': ['', []]
    });

    this.editPassword = this.formBuilder.group({
      'clave': ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)]],
      'confirmar-clave': ['', [Validators.required]]
    })


    this.rootService.getAdmin(this.DNI, this.user).subscribe(
      user => {
        this.user = user
        const generos = GENRES.filter(genero => user.preferencias.includes(genero.id));
        this.initialUserData = user;
        this.initialUserData.preferencias = generos;

        const direccion = this.splitAddress(user.direccion_envio)

        this.jsonService.fetchJson("countries+states+cities").subscribe(_countries => {
          this.countries = _countries;
          const pais = this.countries.find((country: { name: any; }) => country.name === user.pais)
          this.editInfoForm.get("pais")?.setValue(pais)
          this.onCountryChange();

          let estado = pais.states.find((state: { name: any; }) => state.name === user.estado)
          estado = estado ? estado : { name: pais.name, cities: [] };
          this.editInfoForm.get("estado")?.setValue(estado)
          this.onStateChange();
          
          let ciudad = estado.cities ? estado.cities.find((city: { name: any; }) => city.name === user.ciudad) : null
          ciudad = ciudad ? ciudad : { name: pais.name };
          this.editInfoForm.get("ciudad")?.setValue(ciudad)

        
          this.editInfoForm.patchValue({
              DNI:  user.DNI,
              nombre: user.nombre,
              apellido: user.apellido,
              fecha_nacimiento: this.convertToLocalDate(user.fecha_nacimiento),
              pais: pais,
              estado: estado,
              ciudad: ciudad,
              direccion_envio: {
                tipo_via: direccion.tipo_via ,
                nombre_via: direccion.nombre_via ,
                numero_exterior: direccion.numero_exterior,
                numero_interior: direccion.numero_interior 
              },
              genero: user.genero,
              correo_electronico: user.correo_electronico,
              usuario: user.usuario,  
              preferencias: generos,
            })
        })
      }
    )

    this.maxDate = new Date();
    const maxBirthYear = this.maxDate.getFullYear() - 18;
    this.maxDate.setFullYear(maxBirthYear);

    this.minDate = new Date();
    const minBirtYear = this.minDate.getFullYear() - 101;
    this.minDate.setFullYear(minBirtYear);
  }

  // 
  onCountryChange(){
    const selectedCountry = this.editInfoForm.get('pais')?.value;

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

    this.cities = (selectedState.cities && selectedState.cities.length) > 0 ? selectedState.cities : [{name: selectedCountry.name}];
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

    const formAddress = this.editInfoForm.get('direccion_envio') as FormGroup;
    const typeRoad = formAddress.get('tipo_via')?.value;
    const nameRoad = formAddress.get('nombre_via')?.value;
    const outNumber = formAddress.get('numero_exterior')?.value;
    const inNumber = formAddress.get('numero_interior')?.value;
    const completeAddress = `${nameRoad} ${typeRoad} ${outNumber} ${inNumber}`;

    const formData: User = Object.assign({}, this.editInfoForm.value);

    formData.pais = country;
    formData.estado = state;
    formData.ciudad = city;
    formData.direccion_envio = completeAddress; 

    const changedData = this.getChangedData(formData);
    
    this.rootService.editAdmin(this.DNI, changedData).subscribe({
      next: (r) => {
        if(r.success) this.toastService.showSuccessToast("Exito", "Se actualizaron los detalles de la cuenta.")
      },
      error: (error) => {
        this.toastService.showErrorToast("Error", error);
      }
    });
  }


  private splitAddress(address: string) {
    const numeros = address.match(/\d+/g);
    if(numeros) {
    
      const parte3 = numeros[numeros.length - 2];
      const parte4 = numeros[numeros.length - 1];
      
      
      let textoSinNumeros = address.replace(parte3, '').replace(parte4, '').trim();
      
      const palabras = textoSinNumeros.split(' ');
      const parte2 = palabras.pop(); 
      const parte1 = palabras.join(' '); 
      return {tipo_via: parte2,
        nombre_via: parte1,
        numero_exterior: parte3 ,
        numero_interior: parte4}
  
  }else{
    throw new Error('La cadena no tiene el formato esperado con dos números al final.');

  }
}

  onSubmitPass(){
    if(this.editPassword.invalid){
      Object.keys(this.editPassword.controls).forEach(field => {
        const control = this.editPassword.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      
      return;
    }
    
    if(this.editPassword.get('clave')?.value === this.editPassword.get('confirmar-clave')?.value) {
      
        this.rootService.editAdmin(this.DNI, this.editPassword.value).subscribe({
          next: (r) => {
            this.editPassword.get("clave")?.setValue("");
            this.editPassword.get("confirmar-clave")?.setValue("");
            this.editPassword.get("clave_actual")?.setValue("");
            if(r.success) this.toastService.showSuccessToast("Exito", "Se actualiza la clave de la cuenta.");
          },
          error: (error) => {
            this.toastService.showErrorToast("Error", error);
          }
        });
      }
      
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
      if (formData[key] !== this.initialUserData[key]) {

        if (key === 'fecha_nacimiento' && formData[key] instanceof Date) {
          const date = formData[key] as Date;
          const formattedDate = this.formatDateToYYYYMMDD(date);

          if(formattedDate !== this.initialUserData[key]) changedData[key] = formattedDate;
        } else {
          changedData[key] = formData[key];
        }
      }
    });
    return changedData;
  }
 }
