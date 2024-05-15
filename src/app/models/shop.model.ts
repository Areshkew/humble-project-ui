import { Time } from "@angular/common";

export interface Shop {
    ubicaion: string;
    nombre: string;
    num_contacto: string;
    correo: string;
    hora_apertura: Time
    hora_cierre: Time
  }