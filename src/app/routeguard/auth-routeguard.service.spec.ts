import { TestBed } from '@angular/core/testing';

import { AuthRouteguardService } from './auth-routeguard.service';

describe('AuthRouteguardService', () => {
  let service: AuthRouteguardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthRouteguardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
