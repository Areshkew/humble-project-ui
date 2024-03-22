import { Component, OnInit } from '@angular/core';
import { IconComponent } from '../shared/icon/icon.component';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [IconComponent, StepsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  items!: MenuItem[];

  constructor(private router: Router){}

  ngOnInit(): void {
    {
      label: 'Gestion de Informacion';
      RouterLink: 'informacion-personal'
    }
    {
      label: 'Gestion Financiera';
      RouterLink; 'gestion-financiera'
    }
    
  }
}
