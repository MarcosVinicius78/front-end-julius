import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinksBannersComponent } from './links-banners.component';

describe('LinksBannersComponent', () => {
  let component: LinksBannersComponent;
  let fixture: ComponentFixture<LinksBannersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinksBannersComponent]
    });
    fixture = TestBed.createComponent(LinksBannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
