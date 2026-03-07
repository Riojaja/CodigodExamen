import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/layout/sidebar/sidebar';
import { FooterComponent } from './components/layout/footer/footer';
import { AuthFacadeService } from './core/services/auth-facade';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'HOTELSITO';
  constructor(private authService: AuthFacadeService) {}
  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}