import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ReservaService } from '../../../core/services/reserva';
import { HuespedService } from '../../../core/services/huesped';
import { HabitacionService } from '../../../core/services/habitacion';
import { TipoHabitacionService } from '../../../core/services/tipo-habitacion';
import { AuthFacadeService } from '../../../core/services/auth-facade';

import { Reserva } from '../../../models/reserva';
import { Huesped } from '../../../models/huesped';
import { TipoHabitacion } from '../../../models/tipo-habitacion';
import { Habitacion } from '../../../models/habitacion';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reserva-form.html',
  styleUrls: ['./reserva-form.css']
})
export class ReservaFormComponent implements OnInit {
  reserva: Reserva = {
    idReserva: 0,
    huesped: {} as Huesped,
    habitacion: {} as Habitacion,
    fechaInicio: '',
    fechaFin: '',
    noches: 0,
    precioNoche: 0,
    total: 0
  };

  huespedes: Huesped[] = [];
  tipos: TipoHabitacion[] = [];
  habitacionesDisponibles: Habitacion[] = [];
  idTipoSeleccionado: number = 0;
  editMode: boolean = false;
  error: string = '';
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservaService: ReservaService,
    private huespedService: HuespedService,
    private habitacionService: HabitacionService,
    private tipoService: TipoHabitacionService,
    public authService: AuthFacadeService
  ) {}

  ngOnInit(): void {
    this.cargarHuespedes();
    this.cargarTipos();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.cargarReserva(Number(id));
    }
  }

  cargarHuespedes(): void {
    this.huespedService.listar().subscribe({
      next: (data: Huesped[]) => (this.huespedes = data),
      error: (err: any) => console.error('Error cargando huéspedes', err)
    });
  }

  cargarTipos(): void {
    this.tipoService.listar().subscribe({
      next: (data: TipoHabitacion[]) => (this.tipos = data),
      error: (err: any) => console.error('Error cargando tipos', err)
    });
  }

  cargarReserva(id: number): void {
    this.loading = true;
    this.reservaService.obtener(id).subscribe({
      next: (data: Reserva) => {
        this.reserva = data;
        // CORRECCIÓN: Usamos el operador de aserción no nulo (!) porque confiamos en que habitacion y tipo existen
        this.idTipoSeleccionado = data.habitacion!.tipo!.idTipo;
        this.cargarHabitacionesPorTipo();
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error cargando reserva', err);
        this.error = 'No se pudo cargar la reserva';
        this.loading = false;
      }
    });
  }

  cargarHabitacionesPorTipo(): void {
    if (this.idTipoSeleccionado) {
      this.habitacionService.buscarDisponiblesPorTipo(this.idTipoSeleccionado).subscribe({
        next: (data: Habitacion[]) => (this.habitacionesDisponibles = data),
        error: (err: any) => console.error('Error cargando habitaciones', err)
      });
    } else {
      this.habitacionesDisponibles = [];
    }
  }

  onTipoChange(): void {
    // Limpiar la habitación seleccionada al cambiar el tipo
    this.reserva.habitacion = {} as Habitacion;
    this.cargarHabitacionesPorTipo();
  }

  onSubmit(): void {
    // Validaciones
    if (!this.reserva.huesped?.idHuesped) {
      this.error = 'Debe seleccionar un huésped';
      return;
    }
    if (!this.reserva.habitacion?.idHabitacion) {
      this.error = 'Debe seleccionar una habitación';
      return;
    }
    if (!this.reserva.fechaInicio || !this.reserva.fechaFin) {
      this.error = 'Debe ingresar fechas de inicio y fin';
      return;
    }

    const fechaInicio = new Date(this.reserva.fechaInicio);
    const fechaFin = new Date(this.reserva.fechaFin);
    if (fechaInicio >= fechaFin) {
      this.error = 'La fecha de fin debe ser posterior a la de inicio';
      return;
    }

    this.loading = true;
    const operacion = this.editMode
      ? this.reservaService.actualizar(this.reserva.idReserva, this.reserva)
      : this.reservaService.crear(this.reserva);

    operacion.subscribe({
      next: () => this.router.navigate(['/reservas']),
      error: (err: any) => {
        console.error('Error guardando reserva', err);
        this.error = 'No se pudo guardar la reserva';
        this.loading = false;
      }
    });
  }
}