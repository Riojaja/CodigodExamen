import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReservaService } from '../../../core/services/reserva';
import { AuthFacadeService } from '../../../core/services/auth-facade';
import { Reserva } from '../../../models/reserva';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reserva-list.html',
  styleUrls: ['./reserva-list.css']
})
export class ReservaListComponent implements OnInit {
  reservas: Reserva[] = [];
  loading = false;
  error = '';
  successMessage = ''; // Mensaje de éxito
  isAdmin = false;

  constructor(
    private reservaService: ReservaService,
    private authService: AuthFacadeService
  ) {}

  async ngOnInit() {
    this.isAdmin = await this.authService.hasRole('ADMIN');
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.loading = true;
    this.reservaService.listar().subscribe({
      next: (data: Reserva[]) => {
        this.reservas = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error cargando reservas', err);
        this.error = 'No se pudieron cargar las reservas';
        this.loading = false;
      }
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Está seguro de eliminar esta reserva?')) {
      this.reservaService.eliminar(id).subscribe({
        next: () => {
          this.successMessage = 'Reserva eliminada correctamente.';
          this.cargarReservas();
          // Ocultar mensaje después de 3 segundos
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err: any) => {
          console.error('Error eliminando reserva', err);
          this.error = 'No se pudo eliminar la reserva';
        }
      });
    }
  }

  generarPdf(id: number): void {
    this.reservaService.generarPdf(id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      error: (err: any) => {
        console.error('Error generando PDF', err);
        this.error = 'No se pudo generar el PDF';
      }
    });
  }
}