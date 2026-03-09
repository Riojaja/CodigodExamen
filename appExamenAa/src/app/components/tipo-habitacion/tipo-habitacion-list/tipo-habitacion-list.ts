import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TipoHabitacionService } from '../../../core/services/tipo-habitacion';
import { TipoHabitacion } from '../../../models/tipo-habitacion';
import { AuthFacadeService } from '../../../core/services/auth-facade';
import { NotificationService } from '../../../core/services/notification';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-habitacion-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tipo-habitacion-list.html',
  styleUrls: ['./tipo-habitacion-list.css']
})
export class TipoHabitacionListComponent implements OnInit {
  tipos: TipoHabitacion[] = [];
  tiposFiltrados: TipoHabitacion[] = [];
  loading = false;
  isAdmin = false;

  filtroNombre: string = '';
  precioMin: number | null = null;
  precioMax: number | null = null;

  // Paginación - propiedades simples
  paginaActual = 1;
  itemsPorPagina = 10;
  tiposPaginados: TipoHabitacion[] = [];
  totalPaginas = 0;

  constructor(
    private tipoService: TipoHabitacionService,
    private authService: AuthFacadeService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef
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
        this.aplicarFiltros();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.notification.error('Error al cargar los tipos de habitación');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltros(): void {
    this.paginaActual = 1;
    this.tiposFiltrados = this.tipos.filter(t => {
      if (this.filtroNombre && !t.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())) return false;
      if (this.precioMin !== null && t.precioNoche < this.precioMin) return false;
      if (this.precioMax !== null && t.precioNoche > this.precioMax) return false;
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
    this.precioMin = null;
    this.precioMax = null;
    this.aplicarFiltros();
  }

  eliminar(id: number): void {
    Swal.fire({
      title: 'Eliminar tipo de habitación',
      text: '¿Está seguro de eliminar este tipo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoService.eliminar(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Tipo de habitación eliminado correctamente.', 'success');
            this.cargarTipos();
          },
          error: (err) => {
            console.error(err);
            if (err.status === 409) {
              Swal.fire('Error', 'No se puede eliminar porque hay habitaciones que dependen de este tipo.', 'error');
            } else {
              Swal.fire('Error', 'No se pudo eliminar el tipo de habitación.', 'error');
            }
          }
        });
      }
    });
  }

  get totalTipos(): number {
    return this.tiposFiltrados.length;
  }

  get precioPromedio(): number {
    if (this.tiposFiltrados.length === 0) return 0;
    const suma = this.tiposFiltrados.reduce((acc, t) => acc + t.precioNoche, 0);
    return suma / this.tiposFiltrados.length;
  }

  private actualizarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.tiposFiltrados.length / this.itemsPorPagina);
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    this.tiposPaginados = this.tiposFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
      this.cdr.detectChanges();
    }
  }
}