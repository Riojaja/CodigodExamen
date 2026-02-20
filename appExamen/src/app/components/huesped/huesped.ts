import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HuespedService } from '../../services/huesped';
import { Huesped } from '../../models/huesped';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-huesped',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './huesped.html',
  styleUrl: './huesped.css'
})
export class HuespedComponent implements OnInit {
  huespedes: Huesped[] = [];

  huesped: any = {
    idHuesped: null,
    nombre: '',
    dni: '',
    telefono: '',
    email: ''
  };

  paginaActual: number = 1;
  itemsPorPagina: number = 6;

  constructor(private huespedService: HuespedService) { }

  ngOnInit(): void {
    this.listar();
  }

  // --- MÉTODOS DE APOYO PARA VALIDACIÓN ---

  soloNumeros(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  formatearNombre(): void {
    if (this.huesped.nombre) {
      this.huesped.nombre = this.huesped.nombre
        .toLowerCase()
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }

  // --- MÉTODOS CRUD ---

  listar(): void {
    this.huespedService.listar().subscribe({
      next: (data: Huesped[]) => {
        this.huespedes = data;
      },
      error: (err: any) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo obtener la lista', 'error');
      }
    });
  }

  get paginados(): Huesped[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.huespedes.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.huespedes.length / this.itemsPorPagina) || 1;
  }

  guardar(): void {
    const d = this.huesped;
    const dniLimpio = d.dni?.toString().trim();
    const telLimpio = d.telefono?.toString().trim();

    if (!d.nombre || d.nombre.trim() === '') {
      Swal.fire('Atención', 'El nombre es obligatorio', 'warning');
      return;
    }

    if (!dniLimpio || dniLimpio.length !== 8) {
      Swal.fire('Atención', 'El DNI debe tener exactamente 8 números', 'error');
      return;
    }

    if (!telLimpio || telLimpio.length !== 9) {
      Swal.fire('Atención', 'El Teléfono debe tener exactamente 9 números', 'error');
      return;
    }

    if (!d.email || !d.email.toLowerCase().endsWith('@gmail.com')) {
      Swal.fire('Atención', 'Debe ingresar un correo válido de @gmail.com', 'error');
      return;
    }

    this.huesped.dni = dniLimpio;
    this.huesped.telefono = telLimpio;

    this.huespedService.registrar(this.huesped).subscribe({
      next: () => {
        // --- CAMBIO SOLICITADO AQUÍ ---
        Swal.fire({
          icon: 'success',
          title: d.idHuesped ? 'Huésped Actualizado' : 'Huésped Guardado',
          text: 'Los datos se procesaron correctamente',
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#0d6efd' // Azul Bootstrap
        });

        this.listar();
        this.limpiar();
      },
      error: (err: any) => {
        console.error('Error del servidor:', err);
        const msg = err.status === 409 ? 'El DNI ya pertenece a otro huésped' : 'No se pudo procesar la solicitud';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  prepararEdicion(h: Huesped): void {
    this.huesped = { ...h };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: number | any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.huespedService.eliminar(id).subscribe({
          next: () => {
            this.listar();
            Swal.fire({
              title: 'Eliminado',
              text: 'El huésped ha sido borrado',
              icon: 'success',
              confirmButtonColor: '#0d6efd'
            });
          },
          error: (err) => Swal.fire('Error', 'No se puede eliminar porque tiene reservas activas', 'error')
        });
      }
    });
  }

  limpiar(): void {
    this.huesped = {
      idHuesped: null,
      nombre: '',
      dni: '',
      telefono: '',
      email: ''
    };
  }
}