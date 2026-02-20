import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoHabitacion } from '../models/tipo-habitacion';

@Injectable({ providedIn: 'root' })
export class TipoHabitacionService {
  private url = 'http://localhost:8080/api/tipos'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  listar(): Observable<TipoHabitacion[]> {
    return this.http.get<TipoHabitacion[]>(this.url);
  }

  registrar(tipo: TipoHabitacion): Observable<TipoHabitacion> {
    return this.http.post<TipoHabitacion>(this.url, tipo);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}