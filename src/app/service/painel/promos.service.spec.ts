/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PromosService } from './promos.service';

describe('Service: Promos', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromosService]
    });
  });

  it('should ...', inject([PromosService], (service: PromosService) => {
    expect(service).toBeTruthy();
  }));
});
