import { Component } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user.service';
import { ToastService } from '@services/utils/toast.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [CommonModule, RouterLink, CheckboxModule],
  templateUrl: './shopping.component.html',
  styleUrl: './shopping.component.css'
})
export class ShoppingComponent {

  userId: any = this.authService.getUserIdFromToken();
  facturas: any;
  selectedItems: Set<string> = new Set();
  showMenu: boolean = false
  facturasAgrupadas: any = {};

  constructor(private authService: AuthService, private userService: UserService, private toastService: ToastService) { }

  ngOnInit() {
    this.obtenerComprasRealizadas()
  }

  obtenerComprasRealizadas() {
    this.userService.obtenerFacturas(this.userId).subscribe((facturas: any) => {
      this.facturas = facturas
      this.facturas.forEach((factura: any) => {
        let numFactura = factura[0]
        if (!this.facturasAgrupadas[numFactura]) {
          this.facturasAgrupadas[numFactura] = {
            numero: numFactura,
            libros: [],

          };
        }
        this.facturasAgrupadas[numFactura].libros.push({
          issn: factura[1],
          titulo: factura[2],
          tienda: factura[3],
          estado: factura[4],
        });
      });

      this.facturasAgrupadas = Object.values(this.facturasAgrupadas);
    }, error => {
      console.error('Error al cargar la información de los libros', error);
    });
  }

  toggleSelection(facturaId: number, index: number) {
    const itemKey = `${facturaId}-${index}`;
    if (this.selectedItems.has(itemKey)) {
      this.selectedItems.delete(itemKey);
    } else {
      this.selectedItems.add(itemKey);
    }
  }

  isSelected(facturaId: number, index: number): boolean {
    return this.selectedItems.has(`${facturaId}-${index}`);
  }
  menuDevolucion() {
    this.showMenu = !this.showMenu;
  }

  realizarDevolucion() {

    const selectedISSNs: string[] = [];
    for (const key of this.selectedItems) {
      const [facturaId, index] = key.split('-').map(Number);
      const factura = this.facturasAgrupadas.find((f: any) => f.numero === facturaId);
      if (factura) {
        const libro = factura.libros[index];
        selectedISSNs.push(libro.issn);
      }
    }
    this.userService.generarCodigoDevoluciones(this.userId, selectedISSNs).subscribe({
      next: (response) => {
        if (response.Success) {
          this.showMenu = !this.showMenu
          this.toastService.showSuccessToast("Exito", "Revisa tu correo");
        }
      },
      error: (error) => {
        this.toastService.showErrorToast("Error al generar código para la devolución", error);
      }
    });
  }
}