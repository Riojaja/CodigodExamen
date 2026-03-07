import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Huesped } from '../../models/huesped';

@Injectable({
  providedIn: 'root'
})
export class HuespedService {
  private apiUrl = `${environment.apiUrl}/huespedes`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Huesped[]> {
    return this.http.get<Huesped[]>(this.apiUrl);
  }

  obtener(id: number): Observable<Huesped> {
    return this.http.get<Huesped>(`${this.apiUrl}/${id}`);
  }

  crear(huesped: Huesped): Observable<Huesped> {
    return this.http.post<Huesped>(this.apiUrl, huesped);
  }

  actualizar(id: number, huesped: Huesped): Observable<Huesped> {
    return this.http.put<Huesped>(`${this.apiUrl}/${id}`, huesped);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}