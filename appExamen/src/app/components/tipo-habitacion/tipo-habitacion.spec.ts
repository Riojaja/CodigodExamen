import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoHabitacion } from './tipo-habitacion';

describe('TipoHabitacion', () => {
  let component: TipoHabitacion;
  let fixture: ComponentFixture<TipoHabitacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoHabitacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoHabitacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
