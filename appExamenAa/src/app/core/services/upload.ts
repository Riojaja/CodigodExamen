import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  /**
   * Sube un archivo al servidor y devuelve la URL pública de la imagen.
   * @param file Archivo a subir (imagen)
   * @returns Observable con la URL de la imagen
   */
  subirImagen(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.apiUrl, formData, { responseType: 'text' });
  }
}