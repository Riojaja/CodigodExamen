import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoHabitacionForm } from './tipo-habitacion-form';

describe('TipoHabitacionForm', () => {
  let component: TipoHabitacionForm;
  let fixture: ComponentFixture<TipoHabitacionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoHabitacionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoHabitacionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
