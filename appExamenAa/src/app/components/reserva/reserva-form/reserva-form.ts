import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

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

  fechaMinima: string = new Date().toISOString().split('T')[0];

  // Disponibilidad
  disponibilidadChecked = false;
  habitacionDisponible = true;
  checkingDisponibilidad = false;
  private disponibilidadSubject = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservaService: ReservaService,
    private huespedService: HuespedService,
    private habitacionService: HabitacionService,
    private tipoService: TipoHabitacionService,
    public authService: AuthFacadeService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.cargarHuespedes();
    this.cargarTipos();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.cargarReserva(Number(id));
    }

    this.disponibilidadSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(() => {
      this.verificarDisponibilidad();
    });
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
    console.log('1. cargarReserva iniciado, id=', id);
    console.log('2. Servicio obtener llamado');
    this.reservaService.obtener(id).subscribe({
      next: (data) => {
        console.log('3. next recibido', data);
        try {
          // Usar NgZone para asegurar que la actualización ocurra dentro de Angular
          this.ngZone.run(() => {
            this.reserva = data;
            if (data.habitacion?.tipo) {
              this.idTipoSeleccionado = data.habitacion.tipo.idTipo;
            } else {
              console.warn('⚠️ Sin datos de habitación/tipo');
              this.idTipoSeleccionado = 0;
              this.error = 'Datos incompletos';
            }
            this.cargarHabitacionesPorTipo();
            console.log('4. loading será false');
            this.loading = false;
            // Forzar detección de cambios
            this.cdr.detectChanges();
            console.log('5. detectChanges ejecutado');
          });
        } catch (e) {
          console.error('❌ Error en next:', e);
          this.error = 'Error procesando reserva';
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('5. error callback', err);
        this.error = 'No se pudo cargar la reserva';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarHabitacionesPorTipo(): void {
    if (this.idTipoSeleccionado) {
      this.habitacionService.buscarDisponiblesPorTipo(this.idTipoSeleccionado).subscribe({
        next: (data: Habitacion[]) => {
          this.ngZone.run(() => {
            this.habitacionesDisponibles = data;
            if (this.reserva.habitacion?.idHabitacion) {
              const existe = data.some(h => h.idHabitacion === this.reserva.habitacion.idHabitacion);
              if (!existe) {
                this.reserva.habitacion = {} as Habitacion;
                this.habitacionDisponible = false;
              }
            }
          });
        },
        error: (err: any) => console.error('Error cargando habitaciones', err)
      });
    } else {
      this.habitacionesDisponibles = [];
      this.reserva.habitacion = {} as Habitacion;
    }
  }

  onTipoChange(): void {
    this.reserva.habitacion = {} as Habitacion;
    this.cargarHabitacionesPorTipo();
    this.disponibilidadChecked = false;
  }

  onFechaHabitacionChange(): void {
    this.disponibilidadChecked = false;
    this.disponibilidadSubject.next();
  }

  verificarDisponibilidad(): void {
    if (!this.reserva.habitacion?.idHabitacion || !this.reserva.fechaInicio || !this.reserva.fechaFin) {
      return;
    }

    this.checkingDisponibilidad = true;
    const idReserva = this.editMode ? this.reserva.idReserva : undefined;

    this.reservaService.verificarDisponibilidad(
      this.reserva.habitacion.idHabitacion,
      this.reserva.fechaInicio,
      this.reserva.fechaFin,
      idReserva
    ).subscribe({
      next: (disponible) => {
        this.ngZone.run(() => {
          this.habitacionDisponible = disponible;
          this.disponibilidadChecked = true;
          this.checkingDisponibilidad = false;
        });
      },
      error: (err) => {
        console.error('Error verificando disponibilidad', err);
        this.ngZone.run(() => {
          this.habitacionDisponible = false;
          this.disponibilidadChecked = true;
          this.checkingDisponibilidad = false;
        });
      }
    });
  }

  validarFechaInicio(): boolean {
    if (!this.reserva.fechaInicio) return false;
    const hoy = new Date(this.fechaMinima);
    const inicio = new Date(this.reserva.fechaInicio);
    return inicio >= hoy;
  }

  validarFechaFin(): boolean {
    if (!this.reserva.fechaInicio || !this.reserva.fechaFin) return false;
    const inicio = new Date(this.reserva.fechaInicio);
    const fin = new Date(this.reserva.fechaFin);
    return fin > inicio;
  }

  onSubmit(): void {
    this.error = '';

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
    if (!this.validarFechaInicio()) {
      this.error = 'La fecha de inicio no puede ser anterior a hoy';
      return;
    }
    if (!this.validarFechaFin()) {
      this.error = 'La fecha de fin debe ser posterior a la de inicio';
      return;
    }
    if (!this.disponibilidadChecked) {
      this.error = 'Debe verificar la disponibilidad de la habitación';
      return;
    }
    if (!this.habitacionDisponible) {
      this.error = 'La habitación no está disponible en las fechas seleccionadas';
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
        this.cdr.detectChanges();
      }
    });
  }
}