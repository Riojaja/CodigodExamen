export interface Habitacion {
  idHabitacion?: number;
  numero: string;
  estado: string;
  tipoHabitacion: any; // Aquí vendrá el objeto TipoHabitacion con su precio
}