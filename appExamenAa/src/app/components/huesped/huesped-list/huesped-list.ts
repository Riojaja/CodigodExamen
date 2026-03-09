import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HuespedService } from '../../../core/services/huesped';
import { Huesped } from '../../../models/huesped';
import { AuthFacadeService } from '../../../core/services/auth-facade';
import { NotificationService } from '../../../core/services/notification';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-huesped-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './huesped-list.html',
  styleUrls: ['./huesped-list.css']
})
export class HuespedListComponent implements OnInit {
  huespedes: Huesped[] = [];
  huespedesFiltrados: Huesped[] = [];
  loading = true;
  isAdmin = false;

  // Filtros
  filtroNombre: string = '';
  filtroDni: string = '';

  // Paginación (propiedades simples)
  paginaActual = 1;
  itemsPorPagina = 8;
  huespedesPaginados: Huesped[] = [];
  totalPaginas = 0;

  constructor(
    private huespedService: HuespedService,
    private authService: AuthFacadeService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
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
        this.aplicarFiltros();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.notification.error('Error al cargar los huéspedes');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltros(): void {
    this.paginaActual = 1;
    this.huespedesFiltrados = this.huespedes.filter(h => {
      if (this.filtroNombre && !h.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())) return false;
      if (this.filtroDni && !h.dni.includes(this.filtroDni)) return false;
      return true;
    });
    this.actualizarPaginacion();
    this.cdr.detectChanges();
  }

  onFiltroChange(): void {
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroDni = '';
    this.aplicarFiltros();
  }

  private actualizarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.huespedesFiltrados.length / this.itemsPorPagina);
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    this.huespedesPaginados = this.huespedesFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
      this.cdr.detectChanges();
    }
  }

  eliminar(id: number): void {
    Swal.fire({
      title: 'Eliminar huésped',
      text: '¿Está seguro de eliminar este huésped?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.huespedService.eliminar(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Huésped eliminado correctamente.', 'success');
            this.cargarHuespedes();
          },
          error: (err) => {
            if (err.status === 409) {
              Swal.fire('Error', 'No se puede eliminar porque hay reservas que dependen de este huésped.', 'error');
            } else {
              Swal.fire('Error', 'No se pudo eliminar', 'error');
            }
          }
        });
      }
    });
  }

  get totalHuespedes(): number {
    return this.huespedesFiltrados.length;
  }
}