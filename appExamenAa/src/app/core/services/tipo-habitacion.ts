import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TipoHabitacion } from '../../models/tipo-habitacion';

@Injectable({
  providedIn: 'root'
})
export class TipoHabitacionService {
  private apiUrl = `${environment.apiUrl}/tipos-habitacion`;

  constructor(private http: HttpClient) {}

  listar(): Observable<TipoHabitacion[]> {
    return this.http.get<TipoHabitacion[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  obtener(id: number): Observable<TipoHabitacion> {
    return this.http.get<TipoHabitacion>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  crear(tipo: TipoHabitacion): Observable<TipoHabitacion> {
    return this.http.post<TipoHabitacion>(this.apiUrl, tipo)
      .pipe(
        catchError(this.handleError)
      );
  }

  actualizar(id: number, tipo: TipoHabitacion): Observable<TipoHabitacion> {
    return this.http.put<TipoHabitacion>(`${this.apiUrl}/${id}`, tipo)
      .pipe(
        catchError(this.handleError)
      );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error en el servidor';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código: ${error.status}, Mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}