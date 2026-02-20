import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private url = 'http://localhost:8080/api/reservas';

  constructor(private http: HttpClient) { }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  // El backend debe retornar el objeto con 'total' y 'noches' calculados
  registrar(reserva: any): Observable<any> {
    return this.http.post<any>(this.url, reserva);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}