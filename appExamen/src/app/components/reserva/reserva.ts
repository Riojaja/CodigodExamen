import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../services/reserva';
import { HuespedService } from '../../services/huesped';
import { HabitacionService } from '../../services/habitacion';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DecimalPipe],
  templateUrl: './reserva.html',
  styleUrl: './reserva.css'
})
export class ReservaComponent implements OnInit {
  reservas: any[] = [];
  huespedes: any[] = [];
  habitaciones: any[] = [];
  
  reservaSeleccionada: any = null;
  paginaActual: number = 1;
  itemsPorPagina: number = 6;
  fechaMinima: string = '';

  reserva: any = {
    idReserva: null,
    huesped: { idHuesped: null }, 
    habitacion: { idHabitacion: null },
    fechaInicio: '',
    fechaFin: ''
  };

  constructor(
    private reservaService: ReservaService,
    private huespedService: HuespedService,
    private habitacionService: HabitacionService
  ) {
    this.fechaMinima = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.reservaService.listar().subscribe((data: any) => this.reservas = data);
    this.huespedService.listar().subscribe((data: any) => this.huespedes = data);
    this.habitacionService.listar().subscribe((data: any) => this.habitaciones = data);
  }

  get reservasPaginadas() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.reservas.slice(inicio, inicio + this.itemsPorPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.reservas.length / this.itemsPorPagina) || 1;
  }

  prepararBoleta(r: any): void {
    this.reservaSeleccionada = r;
  }

  descargarPDF(): void {
    if (this.reservaSeleccionada) {
      this.generarPDF(this.reservaSeleccionada);
    }
  }

  guardar(): void {
    // 1. Validar campos obligatorios
    if (!this.reserva.huesped.idHuesped || !this.reserva.habitacion.idHabitacion || !this.reserva.fechaInicio || !this.reserva.fechaFin) {
      Swal.fire('Atención', 'Complete todos los campos obligatorios', 'warning');
      return;
    }

    // 2. Validar que la fecha de salida sea después de la de entrada
    if (this.reserva.fechaFin <= this.reserva.fechaInicio) {
      Swal.fire('Error de Fechas', 'La fecha de salida debe ser posterior a la de entrada', 'error');
      return;
    }

    // --- 3. LÓGICA DE TRASLAPE DE FECHAS (DISPONIBILIDAD REAL) ---
    const hayCruce = this.reservas.some(r => {
      // Si estamos editando, ignorar la propia reserva que estamos modificando
      if (this.reserva.idReserva && r.idReserva === this.reserva.idReserva) return false;

      // Verificar si es la misma habitación
      if (r.habitacion.idHabitacion == this.reserva.habitacion.idHabitacion) {
        const inicioNueva = new Date(this.reserva.fechaInicio).getTime();
        const finNueva = new Date(this.reserva.fechaFin).getTime();
        const inicioExistente = new Date(r.fechaInicio).getTime();
        const finExistente = new Date(r.fechaFin).getTime();

        // Fórmula: Hay cruce si (InicioA < FinB) Y (FinA > InicioB)
        return inicioNueva < finExistente && finNueva > inicioExistente;
      }
      return false;
    });

    if (hayCruce) {
      Swal.fire({
        icon: 'error',
        title: 'Habitación Ocupada',
        text: 'La habitación seleccionada ya tiene una reserva en ese rango de fechas.',
        confirmButtonColor: '#0d6efd'
      });
      return;
    }

    const payload = {
      ...this.reserva,
      huesped: { idHuesped: Number(this.reserva.huesped.idHuesped) },
      habitacion: { idHabitacion: Number(this.reserva.habitacion.idHabitacion) }
    };

    this.reservaService.registrar(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.reserva.idReserva ? 'Actualización Exitosa' : '¡Reserva Confirmada!',
          text: 'La estancia se registró correctamente en el sistema.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#0d6efd',
          showConfirmButton: true
        });
        this.cargarDatos();
        this.limpiar();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo procesar la reserva en el servidor.', 'error');
      }
    });
  }

  prepararEdicion(r: any): void {
    this.reserva = {
      idReserva: r.idReserva,
      huesped: { idHuesped: r.huesped.idHuesped },
      habitacion: { idHabitacion: r.habitacion.idHabitacion },
      fechaInicio: r.fechaInicio,
      fechaFin: r.fechaFin
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Anular esta reserva?',
      text: 'Esta acción liberará la habitación automáticamente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservaService.eliminar(id).subscribe(() => {
          this.cargarDatos();
          Swal.fire({
            title: 'Anulada',
            text: 'La reserva ha sido eliminada.',
            icon: 'success',
            confirmButtonColor: '#0d6efd'
          });
        });
      }
    });
  }

  limpiar(): void {
    this.reserva = { 
      idReserva: null, 
      huesped: { idHuesped: null }, 
      habitacion: { idHabitacion: null }, 
      fechaInicio: '', 
      fechaFin: '' 
    };
  }

  generarPDF(r: any): void {
    const doc = new jsPDF();
    doc.setFillColor(13, 110, 253); 
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('HOTELSITO', 105, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.text('VOUCHER ELECTRÓNICO DE RESERVACIÓN', 105, 28, { align: 'center' });

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(12);
    doc.text(`RESERVA N°: RES-00${r.idReserva}`, 15, 55);
    doc.text(`Fecha Emisión: ${new Date().toLocaleDateString()}`, 140, 55);

    autoTable(doc, {
      startY: 65,
      head: [['Concepto', 'Detalle']],
      body: [
        ['Huésped', r.huesped.nombre],
        ['DNI', r.huesped.dni],
        ['Habitación', `N° ${r.habitacion.numero}`],
        ['Check-In', r.fechaInicio],
        ['Check-Out', r.fechaFin],
        ['Noches', r.noches],
        ['Total Pagado', `S/ ${r.total?.toFixed(2) || '0.00'}`]
      ],
      headStyles: { fillColor: [33, 37, 41] }
    });
    doc.save(`Reserva_${r.huesped.nombre.replace(/\s+/g, '_')}.pdf`);
  }
}