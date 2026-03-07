import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitacionForm } from './habitacion-form';

describe('HabitacionForm', () => {
  let component: HabitacionForm;
  let fixture: ComponentFixture<HabitacionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitacionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitacionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
