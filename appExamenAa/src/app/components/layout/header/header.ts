import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthFacadeService } from '../../../core/services/auth-facade';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  constructor(public authService: AuthFacadeService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Convertir promesa a observable para usar async pipe
  get isAuthenticated$(): Observable<boolean> {
    return from(this.authService.isAuthenticated());
  }

  get user$(): Observable<any> {
    return from(this.authService.getUser());
  }
}