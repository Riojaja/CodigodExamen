import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HuespedService } from '../../services/huesped'; // Ruta ajustada
import { Huesped } from '../../models/huesped';          // Ruta ajustada
import Swal from 'sweetalert2';

@Component({
  selector: 'app-huesped',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './huesped.html', // Asegúrate que el archivo esté en la misma carpeta
  styleUrl: './huesped.css'
})
export class HuespedComponent implements OnInit {
  huespedes: Huesped[] = [];
  huesped: Huesped = { idHuesped: 0, nombre: '', dni: '', telefono: '', email: '' };
  paginaActual: number = 1;
  itemsPorPagina: number = 6;

  constructor(private huespedService: HuespedService) { }

  ngOnInit(): void { this.listar(); }

  listar(): void {
    this.huespedService.listar().subscribe({
      next: (data: Huesped[]) => { // Tipado explícito para evitar TS7006
        this.huespedes = data;
      },
      error: (err: any) => { // Tipado explícito para evitar TS7006
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
    return Math.ceil(this.huespedes.length / this.itemsPorPagina);
  }

  guardar(): void {
    if (!this.huesped.nombre || !this.huesped.dni) {
      Swal.fire('Atención', 'Nombre y DNI son obligatorios', 'warning');
      return;
    }

    this.huespedService.registrar(this.huesped).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Guardado', timer: 1500, showConfirmButton: false });
        this.listar();
        this.limpiar();
      },
      error: (err: any) => Swal.fire('Error', 'No se pudo guardar', 'error')
    });
  }

  prepararEdicion(h: Huesped): void {
    this.huesped = { ...h };
  }

  eliminar(id: number): void {
    this.huespedService.eliminar(id).subscribe({
      next: () => {
        this.listar();
        Swal.fire('Eliminado', '', 'success');
      }
    });
  }

  limpiar(): void {
    this.huesped = { idHuesped: 0, nombre: '', dni: '', telefono: '', email: '' };
  }
}