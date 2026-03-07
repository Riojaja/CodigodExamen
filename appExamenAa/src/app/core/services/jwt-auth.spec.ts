import { TestBed } from '@angular/core/testing';

import { JwtAuth } from './jwt-auth';

describe('JwtAuth', () => {
  let service: JwtAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
