import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacadeService } from '../../core/services/auth-facade';
import { LoginRequest } from '../../core/services/jwt-auth'; // Ajusta la ruta si es necesario

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

  constructor(private authService: AuthFacadeService, private router: Router) {}

  async onSubmit(): Promise<void> {
    this.authService.login(this.credentials).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        console.error(err);
        this.error = 'Usuario o contraseña incorrectos';
      }
    });
  }
}