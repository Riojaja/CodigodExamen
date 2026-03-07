import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HuespedList } from './huesped-list';

describe('HuespedList', () => {
  let component: HuespedList;
  let fixture: ComponentFixture<HuespedList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HuespedList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HuespedList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
