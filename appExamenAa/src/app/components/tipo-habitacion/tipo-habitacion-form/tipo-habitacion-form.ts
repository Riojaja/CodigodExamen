import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TipoHabitacionService } from '../../../core/services/tipo-habitacion';
import { TipoHabitacion } from '../../../models/tipo-habitacion';

@Component({
  selector: 'app-tipo-habitacion-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tipo-habitacion-form.html',
  styleUrls: ['./tipo-habitacion-form.css']
})
export class TipoHabitacionFormComponent implements OnInit {
  tipo: TipoHabitacion = {
    idTipo: 0,
    nombre: '',
    descripcion: '',
    precioNoche: 0
  };
  isEdit = false;
  loading = false;
  error = '';
  success = '';

  constructor(
    private tipoService: TipoHabitacionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.cargarTipo(+id);
    }
  }

  cargarTipo(id: number): void {
    this.loading = true;
    this.tipoService.obtener(id).subscribe({
      next: (data) => {
        this.tipo = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar el tipo de habitación';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    // Validación extra
    if (!this.tipo.nombre || this.tipo.nombre.trim() === '') {
      this.error = 'El nombre es obligatorio.';
      return;
    }
    if (this.tipo.precioNoche <= 0) {
      this.error = 'El precio debe ser mayor a cero.';
      return;
    }

    if (this.isEdit) {
      this.actualizar();
    } else {
      this.crear();
    }
  }

  crear(): void {
    this.loading = true;
    this.tipoService.crear(this.tipo).subscribe({
      next: () => {
        this.success = 'Tipo de habitación creado correctamente';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/tipos-habitacion']), 2000);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al crear el tipo de habitación';
        this.loading = false;
      }
    });
  }

  actualizar(): void {
    this.loading = true;
    this.tipoService.actualizar(this.tipo.idTipo, this.tipo).subscribe({
      next: () => {
        this.success = 'Tipo de habitación actualizado correctamente';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/tipos-habitacion']), 2000);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al actualizar el tipo de habitación';
        this.loading = false;
      }
    });
  }
}