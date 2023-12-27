import { TestBed } from '@angular/core/testing';

import { LinkBannerService } from './link-banner.service';

describe('LinkBannerService', () => {
  let service: LinkBannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkBannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
