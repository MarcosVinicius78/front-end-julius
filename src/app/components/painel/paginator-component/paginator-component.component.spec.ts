import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatorComponentComponent } from './paginator-component.component';

describe('PaginatorComponentComponent', () => {
  let component: PaginatorComponentComponent;
  let fixture: ComponentFixture<PaginatorComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaginatorComponentComponent]
    });
    fixture = TestBed.createComponent(PaginatorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
