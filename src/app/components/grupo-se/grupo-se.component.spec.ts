import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoSeComponent } from './grupo-se.component';

describe('GrupoSeComponent', () => {
  let component: GrupoSeComponent;
  let fixture: ComponentFixture<GrupoSeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrupoSeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoSeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
