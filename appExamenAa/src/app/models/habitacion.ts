import { TipoHabitacion } from './tipo-habitacion';

export interface Habitacion {
  idHabitacion: number;
  numero: string;
  tipo: TipoHabitacion;
  estado: string;
}