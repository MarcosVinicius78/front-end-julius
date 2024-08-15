/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PromosComponent } from './promos.component';

describe('PromosComponent', () => {
  let component: PromosComponent;
  let fixture: ComponentFixture<PromosComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PromosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
