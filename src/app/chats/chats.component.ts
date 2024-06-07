import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user.service';
import { ToastService } from '@services/utils/toast.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css'
})
export class ChatsComponent {
  selectedChat: number = -1
  userId: any = this.authService.getUserIdFromToken();
  rol: any = this.authService.getUserRoleFromToken();
  chatList: any
  message: string = ""

  constructor(private userService: UserService, private toastService: ToastService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadChats()
  }

  loadChats() {
    if (this.rol != "admin") {
      this.userService.getMessages(this.userId).subscribe(chats => {
        this.chatList = chats.map((chat: any) => ({
          ticket_id: chat.ticket_id,
          ticket_asunto: chat.ticket_asunto,
          mensajes: chat.mensajes.map((mensaje: any) => ({
            id_usuario: mensaje[0],
            mensaje: mensaje[1],
            fecha: mensaje[2]
          }))
        }));
        console.log(this.chatList);
      }, error => {
        console.error('Error al cargar los mensajes', error);
      });
    }
    else {
      this.userService.getMessages(this.userId).subscribe(chats => {
        this.chatList = chats.map((chat: any) => ({
          ticket_id: chat.ticket_id,
          ticket_asunto: chat.ticket_asunto,
          mensajes: chat.mensajes.map((mensaje: any) => ({
            id_usuario: mensaje[0],
            mensaje: mensaje[1],
            fecha: mensaje[2]
          }))
        }));
        console.log(this.chatList);
      }, error => {
        console.error('Error al cargar los mensajes', error);
      });
    }
  }

  selectChat(chatID: number) {
    this.selectedChat = chatID
  }

  nuevoChat() {
    this.selectedChat = -1
  }

  enviarTicket() {
    if (this.message.length < 1024) {
      this.userService.enviarMensaje(this.userId, this.message).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.showSuccessToast("Exito", "Mensaje enviado");
            this.loadChats()
          }
        },
        error: (error) => {
          this.toastService.showErrorToast("Error al mandar el mensaje", error);
        }
      });
    }
  }

  responderTicket() {
    if (this.message.length < 1024) {
      this.userService.responderMensaje(this.selectedChat, this.userId, this.message).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.showSuccessToast("Exito", "Respuesta enviada");
            this.loadChats()
          }
        },
        error: (error) => {
          this.toastService.showErrorToast("Error al mandar la respuesta", error);
        }
      });
    }
  }

  borrarChat(ticketId: number) {
    this.userService.borrarMensaje(ticketId).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.showInfoToast("Exito", "Ticket Eliminado")
          this.loadChats()
        }
      },
      error: (error) => {
        this.toastService.showErrorToast("Error al eliminar los mensajes", error);
      }
    });
  }
}
