import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.html',
  styleUrls: ['./confirm-modal.css']
})
export class ConfirmModalComponent {
  @Input() title: string = 'Confirmar acción';
  @Input() message: string = '¿Está seguro de realizar esta acción?';
  @Input() confirmText: string = 'Aceptar';
  @Input() cancelText: string = 'Cancelar';
  constructor(public activeModal: NgbActiveModal) {}
}