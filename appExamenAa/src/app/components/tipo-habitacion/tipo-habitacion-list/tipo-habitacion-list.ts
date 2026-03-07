import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TipoHabitacionService } from '../../../core/services/tipo-habitacion';
import { TipoHabitacion } from '../../../models/tipo-habitacion';
import { AuthFacadeService } from '../../../core/services/auth-facade';

@Component({
  selector: 'app-tipo-habitacion-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tipo-habitacion-list.html',
  styleUrls: ['./tipo-habitacion-list.css']
})
export class TipoHabitacionListComponent implements OnInit {
  tipos: TipoHabitacion[] = [];
  loading = false;
  error = '';
  successMessage = '';
  isAdmin = false;

  constructor(
    private tipoService: TipoHabitacionService,
    private authService: AuthFacadeService
  ) {}

  async ngOnInit() {
    this.isAdmin = await this.authService.hasRole('ADMIN');
    this.cargarTipos();
  }

  cargarTipos(): void {
    this.loading = true;
    this.tipoService.listar().subscribe({
      next: (data) => {
        this.tipos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar los tipos de habitación';
        this.loading = false;
      }
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Está seguro de eliminar este tipo de habitación?')) {
      this.tipoService.eliminar(id).subscribe({
        next: () => {
          this.successMessage = 'Tipo de habitación eliminado correctamente.';
          this.cargarTipos();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error(err);
          this.error = 'Error al eliminar';
        }
      });
    }
  }
}