import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HabitacionService } from '../../../core/services/habitacion';
import { TipoHabitacionService } from '../../../core/services/tipo-habitacion';
import { Habitacion } from '../../../models/habitacion';
import { TipoHabitacion } from '../../../models/tipo-habitacion';

@Component({
  selector: 'app-habitacion-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './habitacion-form.html',
  styleUrls: ['./habitacion-form.css']
})
export class HabitacionFormComponent implements OnInit {
  habitacion: Habitacion = {
    idHabitacion: 0,
    numero: '',
    tipo: { idTipo: 0, nombre: '', descripcion: '', precioNoche: 0 },
    estado: 'Disponible'
  };
  tipos: TipoHabitacion[] = [];
  isEdit = false;
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private habitacionService: HabitacionService,
    private tipoService: TipoHabitacionService
  ) {}

  ngOnInit(): void {
    this.cargarTipos();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.cargarHabitacion(+id);
    }
  }

  cargarTipos(): void {
    this.tipoService.listar().subscribe({
      next: (data) => this.tipos = data,
      error: (err) => console.error('Error al cargar tipos', err)
    });
  }

  cargarHabitacion(id: number): void {
    this.habitacionService.obtener(id).subscribe({
      next: (data) => this.habitacion = data,
      error: (err) => {
        this.error = 'Error al cargar la habitación';
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';

    // Validación extra: asegurar que el tipo seleccionado tenga id
    if (!this.habitacion.tipo || !this.habitacion.tipo.idTipo) {
      this.error = 'Debe seleccionar un tipo de habitación.';
      this.loading = false;
      return;
    }

    const operacion = this.isEdit
      ? this.habitacionService.actualizar(this.habitacion.idHabitacion, this.habitacion)
      : this.habitacionService.crear(this.habitacion);

    operacion.subscribe({
      next: () => {
        this.successMessage = this.isEdit ? 'Habitación actualizada correctamente.' : 'Habitación creada correctamente.';
        // Redirigir después de un breve retraso para mostrar el mensaje
        setTimeout(() => {
          this.router.navigate(['/habitaciones']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error al guardar', err);
        this.error = 'Ocurrió un error al guardar. Intente nuevamente.';
        this.loading = false;
      }
    });
  }
}