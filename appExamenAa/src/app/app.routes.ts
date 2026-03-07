import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { TipoHabitacionListComponent } from './components/tipo-habitacion/tipo-habitacion-list/tipo-habitacion-list';
import { TipoHabitacionFormComponent } from './components/tipo-habitacion/tipo-habitacion-form/tipo-habitacion-form';
import { HabitacionListComponent } from './components/habitacion/habitacion-list/habitacion-list';
import { HabitacionFormComponent } from './components/habitacion/habitacion-form/habitacion-form';
import { HuespedListComponent } from './components/huesped/huesped-list/huesped-list';
import { HuespedFormComponent } from './components/huesped/huesped-form/huesped-form';
import { ReservaListComponent } from './components/reserva/reserva-list/reserva-list';
import { ReservaFormComponent } from './components/reserva/reserva-form/reserva-form';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tipos-habitacion', component: TipoHabitacionListComponent, canActivate: [authGuard] },
  { path: 'tipos-habitacion/nuevo', component: TipoHabitacionFormComponent, canActivate: [authGuard, roleGuard], data: { role: 'ADMIN' } },
  { path: 'tipos-habitacion/editar/:id', component: TipoHabitacionFormComponent, canActivate: [authGuard, roleGuard], data: { role: 'ADMIN' } },
  { path: 'habitaciones', component: HabitacionListComponent, canActivate: [authGuard] },
  { path: 'habitaciones/nuevo', component: HabitacionFormComponent, canActivate: [authGuard, roleGuard], data: { role: 'ADMIN' } },
  { path: 'habitaciones/editar/:id', component: HabitacionFormComponent, canActivate: [authGuard, roleGuard], data: { role: 'ADMIN' } },
  { path: 'huespedes', component: HuespedListComponent, canActivate: [authGuard] },
  { path: 'huespedes/nuevo', component: HuespedFormComponent, canActivate: [authGuard, roleGuard], data: { role: 'ADMIN' } },
  { path: 'huespedes/editar/:id', component: HuespedFormComponent, canActivate: [authGuard, roleGuard], data: { role: 'ADMIN' } },
  { path: 'reservas', component: ReservaListComponent, canActivate: [authGuard] },
  { path: 'reservas/nuevo', component: ReservaFormComponent, canActivate: [authGuard, roleGuard], data: { role: 'ADMIN' } },
  { path: 'reservas/editar/:id', component: ReservaFormComponent, canActivate: [authGuard, roleGuard], data: { role: 'ADMIN' } },
  { path: '', redirectTo: '/reservas', pathMatch: 'full' },
  { path: '**', redirectTo: '/reservas' }
];