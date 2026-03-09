import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthFacadeService } from '../../../core/services/auth-facade';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  user: any = null; // Contendrá username y role normalizado
  private authSubscription!: Subscription;
  private routerSubscription!: Subscription;

  constructor(public authService: AuthFacadeService, private router: Router) {}

  async ngOnInit() {
    // Cargar estado inicial de autenticación
    await this.actualizarEstadoAuth();

    // Suscribirse a cambios en la autenticación (requiere que AuthFacadeService exponga authState$)
    this.authSubscription = this.authService.authState$.subscribe(async (authenticated) => {
      this.isAuthenticated = authenticated;
      if (authenticated) {
        this.user = await this.authService.getUser();
        this.normalizeUserRole(); // Asegurar rol normalizado
      } else {
        this.user = null;
      }
    });

    // Escuchar cuando la navegación termina para cerrar el offcanvas
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeOffcanvas();
      });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  /**
   * Actualiza las propiedades de autenticación y usuario desde el servicio.
   */
  private async actualizarEstadoAuth(): Promise<void> {
    this.isAuthenticated = await this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.user = await this.authService.getUser();
      this.normalizeUserRole();
    } else {
      this.user = null;
    }
  }

  /**
   * Normaliza el rol del usuario para que siempre tenga una propiedad 'role'
   * con valores 'ADMIN' o 'USER'. Soporta distintas estructuras comunes.
   */
  private normalizeUserRole(): void {
    if (!this.user) return;

    // Si ya tiene 'role' y es ADMIN/USER, lo dejamos igual
    if (this.user.role === 'ADMIN' || this.user.role === 'USER') return;

    // Buscar el rol en otros campos posibles
    let roleValue: string | null = null;

    // 1. Campo 'rol' (español)
    if (this.user.rol) {
      roleValue = this.user.rol;
    }
    // 2. Campo 'authorities' (Spring Security) - puede ser array o string
    else if (this.user.authorities) {
      if (Array.isArray(this.user.authorities)) {
        // Buscar algo como 'ROLE_ADMIN' o 'ADMIN'
        const auth = this.user.authorities.find((a: string) => a.includes('ADMIN') || a.includes('USER'));
        if (auth) {
          roleValue = auth.replace('ROLE_', ''); // Quita prefijo ROLE_ si existe
        }
      } else if (typeof this.user.authorities === 'string') {
        roleValue = this.user.authorities.replace('ROLE_', '');
      }
    }
    // 3. Campo 'tipo'
    else if (this.user.tipo) {
      roleValue = this.user.tipo;
    }

    // Asignar role normalizado
    if (roleValue) {
      // Asegurar mayúsculas y valores válidos
      const upperRole = roleValue.toUpperCase();
      if (upperRole.includes('ADMIN')) {
        this.user.role = 'ADMIN';
      } else if (upperRole.includes('USER')) {
        this.user.role = 'USER';
      } else {
        this.user.role = upperRole; // Otro valor, pero lo dejamos
      }
    } else {
      this.user.role = 'USER'; // Valor por defecto si no se encuentra
    }
  }

  /**
   * Getter para determinar si el usuario actual es ADMIN.
   */
  get isAdmin(): boolean {
    return this.user?.role === 'ADMIN';
  }

  logout(): void {
    this.authService.logout();
    // La suscripción a authState$ se encargará de actualizar isAuthenticated y user
    // Navegamos al login después del logout
    this.router.navigate(['/login']);
  }

  navigateAndClose(route: string): void {
    this.router.navigate([route]);
    // No cerramos aquí, se cerrará automáticamente al terminar la navegación
  }

  private closeOffcanvas(): void {
    // Pequeño retraso para permitir que la nueva vista se estabilice
    setTimeout(() => {
      const offcanvasEl = document.getElementById('menuOffcanvas');
      if (offcanvasEl) {
        const bootstrap = (window as any).bootstrap;
        if (bootstrap) {
          const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
          offcanvas?.hide();
        }
      }
    }, 100);
  }
}