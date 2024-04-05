import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router} from '@angular/router';
import { UserService } from '../../../services/auth/user.service';
import { MessageService } from 'primeng/api';

interface User {
  dni: string;
  name: string;
}

@Component({
  selector: 'app-admin-adminusers',
  standalone: true,
  providers: [MessageService],
  imports: [CommonModule, RouterOutlet],
  templateUrl: './admin-adminusers.component.html',
  styleUrl: './admin-adminusers.component.css'
})
export class AdminAdminusersComponent {
  users: User[] = [];
  filteredUsers: User[] = [];

  constructor(private router: Router, private userService: UserService, 
    private messageService: MessageService) {
    this.filteredUsers = this.users
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAdminUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
        }
    );
  }

  filterUsers(text: string) {
    const searchText = text.toLowerCase();

    if (searchText) {
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(searchText) ||
        user.dni.toString().includes(searchText)
      );
    } else {
      this.filteredUsers = this.users;
    }
  }

  agregarUsuario(dniUsuario: string){
      this.router.navigate(['/root/modify-users', dniUsuario]);      
  }

  borrarUsuario(dniUsuario: string){
    if (window.confirm('¿Estás seguro de que quieres borrar este usuario?')) {
      this.userService.deleteUser(dniUsuario).subscribe({
        error: (error) => {
          this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: error });
        }
      });
      window.location.reload()
    }
  }
}
