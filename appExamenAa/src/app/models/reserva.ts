import { Huesped } from './huesped';
import { Habitacion } from './habitacion';

export interface Reserva {
  idReserva: number;
  huesped: Huesped;          // Obligatorio
  habitacion: Habitacion;    // Obligatorio
  fechaInicio: string;
  fechaFin: string;
  noches: number;
  precioNoche: number;
  total: number;
}