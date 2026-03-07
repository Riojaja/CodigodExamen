import { TestBed } from '@angular/core/testing';

import { Huesped } from './huesped';

describe('Huesped', () => {
  let service: Huesped;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Huesped);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
