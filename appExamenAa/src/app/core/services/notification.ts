import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../components/shared/confirm-modal/confirm-modal';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  success(message: string, title?: string): void {
    this.toastr.success(message, title || 'Éxito');
  }

  error(message: string, title?: string): void {
    this.toastr.error(message, title || 'Error');
  }

  info(message: string, title?: string): void {
    this.toastr.info(message, title || 'Información');
  }

  warning(message: string, title?: string): void {
    this.toastr.warning(message, title || 'Advertencia');
  }

  confirm(title: string, message: string): Promise<boolean> {
    console.log('1. Intentando abrir modal');

    // Quitar foco del botón actual para evitar advertencia aria-hidden
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    try {
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        centered: true,
        // windowClass: 'custom-modal' // opcional para estilos personalizados
      });
      console.log('2. Modal abierto, referencia:', modalRef);

      modalRef.componentInstance.title = title;
      modalRef.componentInstance.message = message;
      console.log('3. Propiedades asignadas');

      // Forzar la visibilidad después de abrir (a veces ng-bootstrap no añade la clase show)
      setTimeout(() => {
        const modalElement = document.querySelector('.modal');
        if (modalElement) {
          modalElement.classList.add('show');
          console.log('Clase show añadida manualmente');
        }
      }, 50);

      return modalRef.result
        .then(result => {
          console.log('4. Modal cerrado con resultado:', result);
          return result === true;
        })
        .catch(error => {
          console.error('5. Error en modal:', error);
          return false;
        })
        .finally(() => {
          setTimeout(() => {
            document.querySelector('app-root')?.removeAttribute('aria-hidden');
          }, 200);
        });
    } catch (error) {
      console.error('6. Excepción al abrir modal:', error);
      return Promise.resolve(false);
    }
  }
}