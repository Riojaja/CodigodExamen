import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html', // <--- Quita '.component' si tu archivo es 'app.html'
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.css']    // <--- Lo mismo aquí si es necesario
})
export class App { // <--- Si main.ts busca "App", déjalo como "App"
  title = 'HotelApp';
}