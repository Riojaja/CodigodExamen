import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitacionList } from './habitacion-list';

describe('HabitacionList', () => {
  let component: HabitacionList;
  let fixture: ComponentFixture<HabitacionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitacionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitacionList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
