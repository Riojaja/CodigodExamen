import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reserva } from '../../models/reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient) { }

  // Listar todas las reservas
  listar(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }

  // Obtener una reserva por ID
  obtener(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva reserva
  crear(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.apiUrl, reserva);
  }

  // Actualizar una reserva existente
  actualizar(id: number, reserva: Reserva): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}`, reserva);
  }

  // Eliminar una reserva
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Generar comprobante PDF de una reserva
  generarPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }

  verificarDisponibilidad(idHabitacion: number, fechaInicio: string, fechaFin: string, idReserva?: number): Observable<boolean> {
    let params = `?idHabitacion=${idHabitacion}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    if (idReserva) params += `&idReserva=${idReserva}`;
    return this.http.get<boolean>(`${this.apiUrl}/disponibilidad${params}`);
  }
}