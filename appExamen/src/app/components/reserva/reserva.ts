import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common'; // Importamos DecimalPipe para los precios
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

  paginaActual: number = 1;
  itemsPorPagina: number = 6;

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
  ) { }

  ngOnInit(): void { this.cargarDatos(); }

  cargarDatos(): void {
    this.reservaService.listar().subscribe({
      next: (data: any) => this.reservas = data,
      error: (err: any) => console.error('Error al cargar reservas', err)
    });
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

  guardar(): void {
    if (!this.reserva.huesped.idHuesped || !this.reserva.habitacion.idHabitacion || !this.reserva.fechaInicio || !this.reserva.fechaFin) {
      Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning');
      return;
    }

    const payload = {
      ...this.reserva,
      huesped: { idHuesped: Number(this.reserva.huesped.idHuesped) },
      habitacion: { idHabitacion: Number(this.reserva.habitacion.idHabitacion) }
    };

    this.reservaService.registrar(payload).subscribe({
      next: () => {
        Swal.fire('Éxito', this.reserva.idReserva ? 'Reserva actualizada' : 'Reserva confirmada', 'success');
        this.cargarDatos();
        this.limpiar();
      },
      error: () => Swal.fire('Error', 'No se pudo procesar la reserva', 'error')
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
      title: '¿Eliminar estancia?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservaService.eliminar(id).subscribe(() => {
          this.cargarDatos();
          Swal.fire('Eliminado', 'La reserva ha sido borrada', 'success');
        });
      }
    });
  }

  limpiar(): void {
    this.reserva = { idReserva: null, huesped: { idHuesped: null }, habitacion: { idHabitacion: null }, fechaInicio: '', fechaFin: '' };
  }

  generarPDF(r: any): void {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(33, 37, 41); // Dark color
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('VOUCHER DE RESERVA', 105, 18, { align: 'center' });
    doc.setFontSize(10);
    doc.text('SISTEMA DE GESTIÓN HOTELERA - DESARROLLO DE SW II', 105, 28, { align: 'center' });

    // Body
    doc.setTextColor(40, 40, 40);
    doc.text(`Comprobante N°: RES-00${r.idReserva}`, 15, 50);
    doc.text(`Fecha Emisión: ${new Date().toLocaleDateString()}`, 150, 50);

    autoTable(doc, {
      startY: 60,
      head: [['Descripción', 'Detalle del Registro']],
      body: [
        ['Cliente', r.huesped.nombre],
        ['DNI / Documento', r.huesped.dni],
        ['Habitación', `N° ${r.habitacion.numero}`],
        ['Check-In', r.fechaInicio],
        ['Check-Out', r.fechaFin],
        ['Noches', r.noches.toString()],
        ['Total Pagado', `S/ ${r.total.toFixed(2)}`]
      ],
      headStyles: { fillColor: [13, 110, 253] }
    });

    doc.save(`Comprobante_Reserva_${r.idReserva}.pdf`);
  }
}