import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../../core/services/reserva';
import { AuthFacadeService } from '../../../core/services/auth-facade';
import { NotificationService } from '../../../core/services/notification';
import { Reserva } from '../../../models/reserva';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reserva-list.html',
  styleUrls: ['./reserva-list.css']
})
export class ReservaListComponent implements OnInit {
  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  loading = false;
  isAdmin = false;

  // Paginación - propiedades simples (sin getters)
  paginaActual = 1;
  itemsPorPagina = 10;
  reservasPaginadas: Reserva[] = [];
  totalPaginas = 0;

  // Filtros
  filtroTexto = '';
  filtroFechaInicio: string = '';
  filtroFechaFin: string = '';

  // Estadísticas
  totalNoches = 0;
  totalIngresos = 0;
  reservasHoy = 0;

  constructor(
    private reservaService: ReservaService,
    private authService: AuthFacadeService,
    private notification: NotificationService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef // ← Inyectamos ChangeDetectorRef
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
        this.aplicarFiltros();
        this.loading = false;
        this.cdr.detectChanges(); // ← Forzar actualización de la vista
      },
      error: (err: any) => {
        console.error('Error cargando reservas', err);
        this.notification.error('No se pudieron cargar las reservas');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltros(): void {
    this.reservasFiltradas = this.reservas.filter(reserva => {
      if (this.filtroTexto) {
        const texto = this.filtroTexto.toLowerCase().trim();
        const coincide = 
          reserva.huesped?.nombre?.toLowerCase().includes(texto) ||
          reserva.habitacion?.numero?.toLowerCase().includes(texto) ||
          reserva.habitacion?.tipo?.nombre?.toLowerCase().includes(texto);
        if (!coincide) return false;
      }
      if (this.filtroFechaInicio && reserva.fechaInicio < this.filtroFechaInicio) return false;
      if (this.filtroFechaFin && reserva.fechaFin > this.filtroFechaFin) return false;
      return true;
    });
    this.calcularEstadisticas();
    this.paginaActual = 1;
    this.actualizarPaginacion();
    this.cdr.detectChanges();
  }

  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
    this.aplicarFiltros();
  }

  calcularEstadisticas(): void {
    this.totalNoches = this.reservasFiltradas.reduce((sum, r) => sum + r.noches, 0);
    this.totalIngresos = this.reservasFiltradas.reduce((sum, r) => sum + r.total, 0);
    const hoy = new Date().toISOString().split('T')[0];
    this.reservasHoy = this.reservasFiltradas.filter(r => r.fechaInicio === hoy).length;
  }

  private actualizarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.reservasFiltradas.length / this.itemsPorPagina);
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    this.reservasPaginadas = this.reservasFiltradas.slice(inicio, inicio + this.itemsPorPagina);
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
      title: 'Eliminar reserva',
      text: '¿Está seguro de eliminar esta reserva?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservaService.eliminar(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La reserva ha sido eliminada.', 'success');
            this.cargarReservas();
          },
          error: (err) => {
            if (err.status === 409) {
              Swal.fire('Error', 'No se puede eliminar porque hay dependencias.', 'error');
            } else {
              Swal.fire('Error', 'No se pudo eliminar la reserva', 'error');
            }
          }
        });
      }
    });
  }

  generarPdf(id: number): void {
    this.reservaService.obtener(id).subscribe({
      next: (reserva) => {
        const formatearFecha = (fecha: string) => {
          return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        };

        Swal.fire({
          title: 'Comprobante de reserva',
          html: `
            <div style="text-align: left; font-family: Arial, sans-serif;">
              <p><strong>🧑 Huésped:</strong> ${reserva.huesped?.nombre || 'N/A'}</p>
              <p><strong>🛏️ Habitación:</strong> ${reserva.habitacion?.numero} (${reserva.habitacion?.tipo?.nombre})</p>
              <p><strong>📅 Fecha inicio:</strong> ${formatearFecha(reserva.fechaInicio)}</p>
              <p><strong>📅 Fecha fin:</strong> ${formatearFecha(reserva.fechaFin)}</p>
              <p><strong>🌙 Noches:</strong> ${reserva.noches}</p>
              <p><strong>💰 Precio por noche:</strong> S/ ${reserva.precioNoche?.toFixed(2)}</p>
              <p><strong>💵 Total:</strong> S/ ${reserva.total?.toFixed(2)}</p>
            </div>
          `,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: '📄 Exportar PDF',
          cancelButtonText: '❌ Cancelar',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          width: 600
        }).then((result) => {
          if (result.isConfirmed) {
            this.reservaService.generarPdf(id).subscribe({
              next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                window.open(url);
              },
              error: (err: any) => {
                console.error('Error generando PDF', err);
                this.notification.error('No se pudo generar el PDF');
              }
            });
          }
        });
      },
      error: (err: any) => {
        console.error('Error al obtener la reserva', err);
        this.notification.error('No se pudo cargar la información de la reserva');
      }
    });
  }
}