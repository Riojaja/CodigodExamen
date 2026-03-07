import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Habitacion } from '../../models/habitacion';

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  private apiUrl = `${environment.apiUrl}/habitaciones`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(this.apiUrl);
  }

  obtener(id: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.apiUrl}/${id}`);
  }

  crear(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.post<Habitacion>(this.apiUrl, habitacion);
  }

  actualizar(id: number, habitacion: Habitacion): Observable<Habitacion> {
    return this.http.put<Habitacion>(`${this.apiUrl}/${id}`, habitacion);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método para buscar habitaciones disponibles por tipo
  buscarDisponiblesPorTipo(idTipo: number): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(`${this.apiUrl}/disponibles-por-tipo`, {
      params: { idTipo: idTipo.toString() }
    });
  }
}