import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacadeService } from '../../core/services/auth-facade';
import { LoginRequest } from '../../core/services/jwt-auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials: LoginRequest = { username: '', password: '' };
  error = '';
  loading = false;
  currentYear: number = new Date().getFullYear();
  showPassword = false;

  constructor(private authService: AuthFacadeService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    console.log('Credenciales a enviar:', this.credentials);
    
    this.authService.login(this.credentials).subscribe({
      next: () => {
        console.log('Login exitoso, redirigiendo');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error en login:', err);
        // Mensaje más específico según el error
        if (err.status === 401) {
          this.error = 'Usuario o contraseña incorrectos';
        } else if (err.status === 0) {
          this.error = 'No se pudo conectar al servidor. Verifica tu conexión.';
        } else {
          this.error = err.error?.message || 'Error al iniciar sesión. Intenta nuevamente.';
        }
        this.loading = false;
      }
    });
  }
}