/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ParceirosComponent } from './parceiros.component';

describe('ParceirosComponent', () => {
  let component: ParceirosComponent;
  let fixture: ComponentFixture<ParceirosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParceirosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParceirosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
