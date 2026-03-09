import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HabitacionService } from '../../../core/services/habitacion';
import { TipoHabitacionService } from '../../../core/services/tipo-habitacion';
import { AuthFacadeService } from '../../../core/services/auth-facade';
import { NotificationService } from '../../../core/services/notification';
import { Habitacion } from '../../../models/habitacion';
import { TipoHabitacion } from '../../../models/tipo-habitacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-habitacion-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './habitacion-list.html',
  styleUrls: ['./habitacion-list.css']
})
export class HabitacionListComponent implements OnInit {
  habitaciones: Habitacion[] = [];
  habitacionesFiltradas: Habitacion[] = [];
  tipos: TipoHabitacion[] = [];
  loading = true;
  isAdmin = false;

  // Filtros
  filtroNumero: string = '';
  filtroTipo: number | null = null;
  filtroEstado: string = '';
  precioMin: number | null = null;
  precioMax: number | null = null;

  // Paginación - propiedades simples
  paginaActual = 1;
  itemsPorPagina = 8;
  habitacionesPaginadas: Habitacion[] = [];
  totalPaginas = 0;

  constructor(
    private habitacionService: HabitacionService,
    private tipoService: TipoHabitacionService,
    private authService: AuthFacadeService,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef // ← Inyectamos ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.isAdmin = await this.authService.hasRole('ADMIN');
    this.cargarTipos();
    this.cargarHabitaciones();
  }

  cargarTipos(): void {
    this.tipoService.listar().subscribe({
      next: (data) => {
        this.tipos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando tipos', err)
    });
  }

  cargarHabitaciones(): void {
    this.loading = true;
    this.habitacionService.listar().subscribe({
      next: (data) => {
        this.habitaciones = data;
        this.aplicarFiltros();
        this.loading = false;
        this.cdr.detectChanges(); // ← Forzar actualización
      },
      error: (err) => {
        this.notification.error('Error al cargar las habitaciones');
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltros(): void {
    this.paginaActual = 1;
    this.habitacionesFiltradas = this.habitaciones.filter(h => {
      // Filtro por número
      if (this.filtroNumero && !h.numero?.toLowerCase().includes(this.filtroNumero.toLowerCase())) {
        return false;
      }
      // Filtro por tipo
      if (this.filtroTipo && h.tipo?.idTipo !== this.filtroTipo) {
        return false;
      }
      // Filtro por estado
      if (this.filtroEstado && h.estado !== this.filtroEstado) {
        return false;
      }
      // Filtro por precio mínimo (usando precioNoche del tipo)
      if (this.precioMin !== null && (h.tipo?.precioNoche ?? 0) < this.precioMin) {
        return false;
      }
      // Filtro por precio máximo
      if (this.precioMax !== null && (h.tipo?.precioNoche ?? 0) > this.precioMax) {
        return false;
      }
      return true;
    });
    this.actualizarPaginacion();
    this.cdr.detectChanges();
  }

  onFiltroChange(): void {
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.filtroNumero = '';
    this.filtroTipo = null;
    this.filtroEstado = '';
    this.precioMin = null;
    this.precioMax = null;
    this.aplicarFiltros();
  }

  eliminar(id: number): void {
    Swal.fire({
      title: 'Eliminar habitación',
      text: '¿Está seguro de eliminar esta habitación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.habitacionService.eliminar(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Habitación eliminada correctamente.', 'success');
            this.cargarHabitaciones();
          },
          error: (err) => {
            if (err.status === 409) {
              Swal.fire('Error', 'No se puede eliminar porque hay reservas que dependen de esta habitación.', 'error');
            } else {
              Swal.fire('Error', 'No se pudo eliminar', 'error');
            }
          }
        });
      }
    });
  }

  // Estadísticas (getters están bien porque solo dependen de habitacionesFiltradas y se actualizan en aplicarFiltros)
  get totalHabitaciones(): number {
    return this.habitacionesFiltradas.length;
  }

  get disponibles(): number {
    return this.habitacionesFiltradas.filter(h => h.estado === 'Disponible').length;
  }

  get ocupadas(): number {
    return this.habitacionesFiltradas.filter(h => h.estado === 'Ocupada').length;
  }

  get mantenimiento(): number {
    return this.habitacionesFiltradas.filter(h => h.estado === 'Mantenimiento').length;
  }

  // Método privado para actualizar paginación
  private actualizarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.habitacionesFiltradas.length / this.itemsPorPagina);
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    this.habitacionesPaginadas = this.habitacionesFiltradas.slice(inicio, inicio + this.itemsPorPagina);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
      this.cdr.detectChanges();
    }
  }
}