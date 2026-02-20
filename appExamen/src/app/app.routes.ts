import { Routes } from '@angular/router';
import { ReservaComponent } from './components/reserva/reserva';
import { HuespedComponent } from './components/huesped/huesped';
import { HabitacionComponent } from './components/habitacion/habitacion';
import { TipoHabitacionComponent } from './components/tipo-habitacion/tipo-habitacion';

export const routes: Routes = [
  { path: 'reservas', component: ReservaComponent },
  { path: 'huespedes', component: HuespedComponent },
  { path: 'habitaciones', component: HabitacionComponent },
  { path: 'tipos', component: TipoHabitacionComponent },
  { path: '', redirectTo: '/reservas', pathMatch: 'full' },
  { path: '**', redirectTo: '/reservas' }
];