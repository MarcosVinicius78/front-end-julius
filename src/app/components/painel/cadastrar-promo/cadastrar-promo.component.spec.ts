/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CadastrarPromoComponent } from './cadastrar-promo.component';

describe('CadastrarPromoComponent', () => {
  let component: CadastrarPromoComponent;
  let fixture: ComponentFixture<CadastrarPromoComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastrarPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
