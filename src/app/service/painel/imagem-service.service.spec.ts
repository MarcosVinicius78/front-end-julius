import { TestBed } from '@angular/core/testing';

import { ImagemServiceService } from './imagem-service.service';

describe('ImagemServiceService', () => {
  let service: ImagemServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagemServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
