import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoHabitacionList } from './tipo-habitacion-list';

describe('TipoHabitacionList', () => {
  let component: TipoHabitacionList;
  let fixture: ComponentFixture<TipoHabitacionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoHabitacionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoHabitacionList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
