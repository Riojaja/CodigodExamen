import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HuespedService } from '../../../core/services/huesped';
import { Huesped } from '../../../models/huesped';
import { AuthFacadeService } from '../../../core/services/auth-facade';

@Component({
  selector: 'app-huesped-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './huesped-list.html',
  styleUrls: ['./huesped-list.css']
})
export class HuespedListComponent implements OnInit {
  huespedes: Huesped[] = [];
  loading = true;
  error = '';
  successMessage = ''; // Mensaje de éxito
  isAdmin = false;

  constructor(
    private huespedService: HuespedService,
    private authService: AuthFacadeService
  ) {}

  async ngOnInit() {
    this.isAdmin = await this.authService.hasRole('ADMIN');
    this.cargarHuespedes();
  }

  cargarHuespedes(): void {
    this.loading = true;
    this.huespedService.listar().subscribe({
      next: (data) => {
        this.huespedes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los huéspedes';
        this.loading = false;
        console.error(err);
      }
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Está seguro de eliminar este huésped?')) {
      this.huespedService.eliminar(id).subscribe({
        next: () => {
          this.successMessage = 'Huésped eliminado correctamente.';
          this.cargarHuespedes();
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