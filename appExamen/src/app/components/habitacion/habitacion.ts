import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitacionService } from '../../services/habitacion';
import { TipoHabitacionService } from '../../services/tipo-habitacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-habitacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habitacion.html',
  styleUrl: './habitacion.css'
})
export class HabitacionComponent implements OnInit {
  habitaciones: any[] = [];
  tipos: any[] = [];
  
  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 6;

  habitacion: any = {
    idHabitacion: null,
    numero: '',
    estado: 'Disponible',
    tipoHabitacion: { idTipo: null }
  };

  constructor(
    private habitacionService: HabitacionService,
    private tipoService: TipoHabitacionService
  ) { }

  ngOnInit(): void {
    this.listarTodo();
  }

  listarTodo() {
    this.habitacionService.listar().subscribe((data: any) => this.habitaciones = data);
    this.tipoService.listar().subscribe((data: any) => this.tipos = data);
  }

  get paginadas() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.habitaciones.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.habitaciones.length / this.itemsPorPagina);
  }

  guardar() {
    // 1. Validación de campos obligatorios
    if (!this.habitacion.numero || !this.habitacion.tipoHabitacion.idTipo) {
      Swal.fire('Atención', 'El número y tipo son obligatorios', 'warning');
      return;
    }

    // 2. VALIDACIÓN: NO PERMITIR NÚMERO DUPLICADO
    // Solo validamos si es un registro nuevo (idHabitacion es null)
    if (!this.habitacion.idHabitacion) {
      const existe = this.habitaciones.some(h => h.numero.toString() === this.habitacion.numero.toString());
      if (existe) {
        Swal.fire('Error', `La habitación N° ${this.habitacion.numero} ya está registrada`, 'error');
        return;
      }
    }

    this.habitacion.tipoHabitacion.idTipo = Number(this.habitacion.tipoHabitacion.idTipo);

    this.habitacionService.registrar(this.habitacion).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.habitacion.idHabitacion ? '¡Actualizado!' : '¡Guardado!',
          text: 'Operación realizada con éxito',
          timer: 1500,
          showConfirmButton: false
        });
        this.listarTodo();
        this.limpiar();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo guardar la habitación', 'error');
      }
    });
  }

  prepararEdicion(h: any) {
    this.habitacion = { 
      idHabitacion: h.idHabitacion,
      numero: h.numero,
      estado: h.estado,
      tipoHabitacion: { idTipo: h.tipoHabitacion.idTipo }
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(h: any) {
    // VALIDACIÓN: NO ELIMINAR SI ESTÁ OCUPADA
    if (h.estado === 'Ocupada') {
      Swal.fire('Acción Bloqueada', 'No se puede eliminar una habitación que está actualmente OCUPADA.', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará la habitación N° ${h.numero}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.habitacionService.eliminar(h.idHabitacion).subscribe(() => {
          this.listarTodo();
          Swal.fire('Eliminado', 'Registro borrado.', 'success');
        });
      }
    });
  }

  limpiar() {
    this.habitacion = { idHabitacion: null, numero: '', estado: 'Disponible', tipoHabitacion: { idTipo: null } };
  }
}