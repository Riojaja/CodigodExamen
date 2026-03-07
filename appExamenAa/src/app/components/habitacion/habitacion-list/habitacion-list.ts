import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HabitacionService } from '../../../core/services/habitacion';
import { Habitacion } from '../../../models/habitacion';
import { AuthFacadeService } from '../../../core/services/auth-facade';

@Component({
  selector: 'app-habitacion-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './habitacion-list.html',
  styleUrls: ['./habitacion-list.css']
})
export class HabitacionListComponent implements OnInit {
  habitaciones: Habitacion[] = [];
  loading = true;
  error = '';
  successMessage = '';
  isAdmin = false;

  constructor(
    private habitacionService: HabitacionService,
    private authService: AuthFacadeService
  ) {}

  async ngOnInit() {
    this.isAdmin = await this.authService.hasRole('ADMIN');
    this.cargarHabitaciones();
  }

  cargarHabitaciones(): void {
    this.loading = true;
    this.habitacionService.listar().subscribe({
      next: (data) => {
        this.habitaciones = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las habitaciones';
        this.loading = false;
        console.error(err);
      }
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Está seguro de eliminar esta habitación?')) {
      this.habitacionService.eliminar(id).subscribe({
        next: () => {
          this.successMessage = 'Habitación eliminada correctamente.';
          this.cargarHabitaciones();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.error = 'Error al eliminar';
          console.error(err);
        }
      });
    }
  }
}