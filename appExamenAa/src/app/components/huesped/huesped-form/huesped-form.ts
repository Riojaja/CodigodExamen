import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HuespedService } from '../../../core/services/huesped';
import { Huesped } from '../../../models/huesped';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-huesped-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './huesped-form.html',
  styleUrls: ['./huesped-form.css']
})
export class HuespedFormComponent implements OnInit {
  huesped: Huesped = {
    idHuesped: 0,
    nombre: '',
    dni: '',
    telefono: '',
    email: ''
  };
  isEdit = false;
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private huespedService: HuespedService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.cargarHuesped(+id);
    }
  }

  cargarHuesped(id: number): void {
    this.loading = true;
    this.huespedService.obtener(id).subscribe({
      next: (data) => {
        this.huesped = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar el huésped';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    const operacion = this.isEdit
      ? this.huespedService.actualizar(this.huesped.idHuesped, this.huesped)
      : this.huespedService.crear(this.huesped);

    operacion.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.isEdit ? '¡Actualizado!' : '¡Creado!',
          text: this.isEdit ? 'El huésped se actualizó correctamente.' : 'El huésped se creó correctamente.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/huespedes']);
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo guardar el huésped. Intente nuevamente.'
        });
        this.loading = false;
      }
    });
  }
}