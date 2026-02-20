import { Huesped } from './huesped';
import { Habitacion } from './habitacion';

export interface Reserva {
  idReserva?: number;
  huesped: Huesped;
  habitacion: Habitacion;
  fechaInicio: string;
  fechaFin: string;
  noches?: number;
  precioNoche?: number;
  total?: number;
}