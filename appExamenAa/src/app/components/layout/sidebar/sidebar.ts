import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthFacadeService } from '../../../core/services/auth-facade';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {
  user: any = null;

  constructor(public authService: AuthFacadeService) {}

  async ngOnInit() {
    this.user = await this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
  }
}