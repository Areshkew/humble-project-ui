import { Component, HostListener} from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { Router} from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { UserService } from '@services/auth/user.service';

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
  user = ["usuario"];

  constructor(private router: Router, private userService: UserService) {
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

    this.userService.getCurrentUser(this.user).subscribe(
      user => {
        this.user = user.usuario
      }
    )
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
