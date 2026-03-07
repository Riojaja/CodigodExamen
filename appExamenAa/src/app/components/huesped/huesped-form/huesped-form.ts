import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HuespedService } from '../../../core/services/huesped';
import { Huesped } from '../../../models/huesped';

@Component({
  selector: 'app-huesped-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './huesped-form.html',
  styleUrls: ['./huesped-form.css']
})
export class HuespedFormComponent implements OnInit {
  huesped: Huesped = {
    idHuesped: 0,
    nombre: '',
    dni: '',
    telefono: '',
    email: ''
  };
  isEdit = false;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private huespedService: HuespedService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.cargarHuesped(+id);
    }
  }

  cargarHuesped(id: number): void {
    this.huespedService.obtener(id).subscribe({
      next: (data) => this.huesped = data,
      error: (err) => {
        this.error = 'Error al cargar el huésped';
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    if (this.isEdit) {
      this.huespedService.actualizar(this.huesped.idHuesped, this.huesped).subscribe({
        next: () => this.router.navigate(['/huespedes']),
        error: (err) => {
          this.error = 'Error al actualizar';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.huespedService.crear(this.huesped).subscribe({
        next: () => this.router.navigate(['/huespedes']),
        error: (err) => {
          this.error = 'Error al crear';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }
}