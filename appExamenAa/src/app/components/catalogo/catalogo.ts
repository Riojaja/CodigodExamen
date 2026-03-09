import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HabitacionService } from '../../core/services/habitacion';
import { TipoHabitacionService } from '../../core/services/tipo-habitacion';
import { Habitacion } from '../../models/habitacion';
import { TipoHabitacion } from '../../models/tipo-habitacion';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css']
})
export class CatalogoComponent implements OnInit {
  habitaciones: Habitacion[] = [];
  habitacionesFiltradas: Habitacion[] = [];
  tipos: TipoHabitacion[] = [];
  loading = false;
  error = '';

  // Filtros
  tipoSeleccionado: number | null = null;
  precioMin: number | null = null;
  precioMax: number | null = null;
  busqueda: string = '';

  // Paginación - ahora como propiedades simples
  paginaActual = 1;
  itemsPorPagina = 6;
  habitacionesPaginadas: Habitacion[] = [];
  totalPaginas = 0;

  // Estadísticas
  precioPromedio = 0;

  constructor(
    private habitacionService: HabitacionService,
    private tipoService: TipoHabitacionService,
    private cdr: ChangeDetectorRef // ← Inyectamos ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTipos();
    this.cargarHabitaciones();
  }

  cargarTipos(): void {
    this.tipoService.listar().subscribe({
      next: (data) => {
        this.tipos = data;
      },
      error: (err) => {
        console.error('Error al cargar tipos', err);
      }
    });
  }

  cargarHabitaciones(): void {
    this.loading = true;
    this.habitacionService.listar().subscribe({
      next: (data) => {
        this.habitaciones = data;
        this.aplicarFiltros(); // Esto ya actualiza las listas y estadísticas
        this.loading = false;
        this.cdr.detectChanges(); // ← Forzar la detección de cambios
      },
      error: (err) => {
        console.error('Error al cargar habitaciones', err);
        this.error = 'No se pudieron cargar las habitaciones.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltros(): void {
    this.paginaActual = 1;

    this.habitacionesFiltradas = this.habitaciones.filter(h => {
      if (this.tipoSeleccionado && h.tipo?.idTipo !== this.tipoSeleccionado) return false;
      if (this.precioMin && h.tipo?.precioNoche < this.precioMin) return false;
      if (this.precioMax && h.tipo?.precioNoche > this.precioMax) return false;
      if (this.busqueda) {
        const term = this.busqueda.toLowerCase().trim();
        const numeroMatch = h.numero?.toLowerCase().includes(term);
        const tipoNombreMatch = h.tipo?.nombre?.toLowerCase().includes(term);
        const tipoDescMatch = h.tipo?.descripcion?.toLowerCase().includes(term);
        if (!(numeroMatch || tipoNombreMatch || tipoDescMatch)) return false;
      }
      return true;
    });

    this.actualizarPaginacionYEstadisticas();
    this.cdr.detectChanges(); // También forzar después de filtrar
  }

  onFiltroChange(): void {
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.tipoSeleccionado = null;
    this.precioMin = null;
    this.precioMax = null;
    this.busqueda = '';
    this.aplicarFiltros();
  }

  private actualizarPaginacionYEstadisticas(): void {
    this.totalPaginas = Math.ceil(this.habitacionesFiltradas.length / this.itemsPorPagina);
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.habitacionesPaginadas = this.habitacionesFiltradas.slice(inicio, fin);
    if (this.habitacionesFiltradas.length === 0) {
      this.precioPromedio = 0;
    } else {
      const suma = this.habitacionesFiltradas.reduce((acc, h) => acc + (h.tipo?.precioNoche || 0), 0);
      this.precioPromedio = suma / this.habitacionesFiltradas.length;
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarPaginacionYEstadisticas();
      this.cdr.detectChanges();
    }
  }
}