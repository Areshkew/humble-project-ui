import { Component, HostListener, OnDestroy} from '@angular/core';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule} from '@angular/router';
import { IconComponent } from '../../shared/icon/icon.component';
import { UserService } from '@services/user.service';
import { Subscription } from 'rxjs';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [IconComponent, TabMenuModule, RouterModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent implements OnDestroy {
  items!: MenuItem[];
  iconSize = 156;
  user = ["usuario"];
  roleSubscription!: Subscription;
  userRole!: string;

  constructor(private router: Router, private userService: UserService, private authService: AuthService) {
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

    this.roleSubscription = this.authService.role$.subscribe(role => {
      this.userRole = role;
    })
  }

  ngOnDestroy(): void {
      if(this.roleSubscription) this.roleSubscription.unsubscribe();
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
