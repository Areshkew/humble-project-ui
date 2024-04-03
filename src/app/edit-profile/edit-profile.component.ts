import { Component, HostListener} from '@angular/core';
import { IconComponent } from '../shared/icon/icon.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { Router} from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [IconComponent, TabMenuModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent  {
  items!: MenuItem[];
  iconSize = 156;

  constructor(private router: Router) {
    this.updateIconSize(window.innerWidth);
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Informacion',
        icon:  'pi pi-fw pi-pencil',
        routerLink: 'informacion-personal',
      },
      {
        label: 'Financiera',
        icon:  'pi pi-fw pi-wallet',
        routerLink: 'gestion-financiera',
      },
    ];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateIconSize((event.target as Window).innerWidth);
  }

  private updateIconSize(width: number) {
    if (width < 900) {
      this.iconSize = 100;
    } else {
      this.iconSize = 156;
    }
  }
}
