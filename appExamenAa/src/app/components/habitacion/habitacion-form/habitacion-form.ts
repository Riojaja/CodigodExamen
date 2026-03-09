import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HabitacionService } from '../../../core/services/habitacion';
import { TipoHabitacionService } from '../../../core/services/tipo-habitacion';
import { UploadService } from '../../../core/services/upload'; // Ajusta la ruta según corresponda
import { Habitacion } from '../../../models/habitacion';
import { TipoHabitacion } from '../../../models/tipo-habitacion';

@Component({
  selector: 'app-habitacion-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './habitacion-form.html',
  styleUrls: ['./habitacion-form.css']
})
export class HabitacionFormComponent implements OnInit {
  habitacion: Habitacion = {
    idHabitacion: 0,
    numero: '',
    tipo: { idTipo: 0, nombre: '', descripcion: '', precioNoche: 0 },
    estado: 'Disponible',
    imagenUrl: '' // Añadimos el campo imagenUrl
  };
  tipos: TipoHabitacion[] = [];
  isEdit = false;
  loading = false;
  error = '';
  successMessage = '';

  // Variables para la imagen
  imagenOption: 'url' | 'file' = 'url'; // por defecto URL
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  uploading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private habitacionService: HabitacionService,
    private tipoService: TipoHabitacionService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.cargarTipos();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.cargarHabitacion(+id);
    }
  }

  cargarTipos(): void {
    this.tipoService.listar().subscribe({
      next: (data) => this.tipos = data,
      error: (err) => console.error('Error al cargar tipos', err)
    });
  }

  cargarHabitacion(id: number): void {
    this.habitacionService.obtener(id).subscribe({
      next: (data) => {
        this.habitacion = data;
        // Si ya tiene imagen, la mostramos en preview
        if (this.habitacion.imagenUrl) {
          this.previewUrl = this.habitacion.imagenUrl;
          // Deducimos la opción: si es URL absoluta, probablemente sea url; si es relativa /uploads, también url
          this.imagenOption = 'url';
        }
      },
      error: (err) => {
        this.error = 'Error al cargar la habitación';
        console.error(err);
      }
    });
  }

  // Maneja la selección de archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      // Previsualización local
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
      // Opcional: podrías subir automáticamente, pero aquí lo haremos al enviar o con un botón "Subir"
      // Por simplicidad, subiremos al enviar el formulario.
    }
  }

  // Método para subir la imagen (puede llamarse antes del envío o al seleccionar)
  uploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        reject('No hay archivo seleccionado');
        return;
      }
      this.uploading = true;
      this.uploadService.subirImagen(this.selectedFile).subscribe({
        next: (url) => {
          this.uploading = false;
          this.habitacion.imagenUrl = url;
          // Actualizamos preview con la URL real
          this.previewUrl = url;
          resolve(url);
        },
        error: (err) => {
          this.uploading = false;
          this.error = 'Error al subir la imagen';
          console.error(err);
          reject(err);
        }
      });
    });
  }

  onSubmit(): void {
    // Validar que se haya seleccionado tipo
    if (!this.habitacion.tipo || !this.habitacion.tipo.idTipo) {
      this.error = 'Debe seleccionar un tipo de habitación.';
      return;
    }

    // Validar la imagen según la opción
    if (this.imagenOption === 'url') {
      if (!this.habitacion.imagenUrl || this.habitacion.imagenUrl.trim() === '') {
        this.error = 'Debe ingresar una URL de imagen.';
        return;
      }
      // Procedemos a guardar directamente
      this.guardar();
    } else {
      // Opción archivo: verificar que haya archivo seleccionado
      if (!this.selectedFile) {
        this.error = 'Debe seleccionar un archivo de imagen.';
        return;
      }
      // Subir la imagen primero, luego guardar
      this.uploadImage().then(() => {
        this.guardar();
      }).catch(() => {
        // Error ya manejado en uploadImage
        this.error = 'No se pudo subir la imagen.';
      });
    }
  }

  guardar(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';

    const operacion = this.isEdit
      ? this.habitacionService.actualizar(this.habitacion.idHabitacion, this.habitacion)
      : this.habitacionService.crear(this.habitacion);

    operacion.subscribe({
      next: () => {
        this.successMessage = this.isEdit ? 'Habitación actualizada correctamente.' : 'Habitación creada correctamente.';
        setTimeout(() => {
          this.router.navigate(['/habitaciones']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error al guardar', err);
        this.error = 'Ocurrió un error al guardar. Intente nuevamente.';
        this.loading = false;
      }
    });
  }
}