import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TipoHabitacion } from '../../models/tipo-habitacion';

@Injectable({
  providedIn: 'root'
})
export class TipoHabitacionService {
  private apiUrl = `${environment.apiUrl}/tipos-habitacion`;

  constructor(private http: HttpClient) {}

  listar(): Observable<TipoHabitacion[]> {
    return this.http.get<TipoHabitacion[]>(this.apiUrl);
  }

  obtener(id: number): Observable<TipoHabitacion> {
    return this.http.get<TipoHabitacion>(`${this.apiUrl}/${id}`);
  }

  crear(tipo: TipoHabitacion): Observable<TipoHabitacion> {
    return this.http.post<TipoHabitacion>(this.apiUrl, tipo);
  }

  actualizar(id: number, tipo: TipoHabitacion): Observable<TipoHabitacion> {
    return this.http.put<TipoHabitacion>(`${this.apiUrl}/${id}`, tipo);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}