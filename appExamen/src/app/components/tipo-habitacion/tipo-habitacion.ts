import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoHabitacionService } from '../../services/tipo-habitacion';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-habitacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipo-habitacion.html',
  styleUrl: './tipo-habitacion.css'
})
export class TipoHabitacionComponent implements OnInit {
  tipos: any[] = [];
  
  // Variables para Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 6;

  tipo: any = {
    idTipo: null,
    nombre: '',
    descripcion: '',
    precioNoche: 0
  };

  constructor(private tipoService: TipoHabitacionService) { }

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.tipoService.listar().subscribe({
      next: (data: any) => this.tipos = data,
      error: (err: any) => console.error("Error al cargar tipos:", err)
    });
  }

  // Lógica de Paginación
  get paginados() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.tipos.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.tipos.length / this.itemsPorPagina);
  }

  guardar(): void {
    if (!this.tipo.nombre || this.tipo.precioNoche <= 0) {
      Swal.fire('Atención', 'Debe ingresar un nombre y un precio válido.', 'warning');
      return;
    }

    this.tipoService.registrar(this.tipo).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.tipo.idTipo ? '¡Categoría Actualizada!' : '¡Categoría Guardada!',
          text: 'Los cambios se aplicaron con éxito',
          timer: 1500,
          showConfirmButton: false
        });
        this.listar();
        this.limpiar();
      },
      error: (err: any) => {
        console.error("Error al guardar:", err);
        Swal.fire('Error', 'No se pudo procesar la solicitud', 'error');
      }
    });
  }

  prepararEdicion(t: any) {
    this.tipo = { ...t };
    Swal.fire({ icon: 'info', title: 'Modo Edición', text: 'Cargando datos de ' + t.nombre, timer: 1000, showConfirmButton: false });
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Eliminar categoría?',
      text: "Esto podría afectar a las habitaciones de este tipo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoService.eliminar(id).subscribe(() => {
          this.listar();
          Swal.fire('Eliminado', 'La categoría ha sido borrada.', 'success');
        });
      }
    });
  }

  limpiar(): void {
    this.tipo = { idTipo: null, nombre: '', descripcion: '', precioNoche: 0 };
  }
}