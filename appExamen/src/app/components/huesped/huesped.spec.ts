import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Huesped } from './huesped';

describe('Huesped', () => {
  let component: Huesped;
  let fixture: ComponentFixture<Huesped>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Huesped]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Huesped);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
