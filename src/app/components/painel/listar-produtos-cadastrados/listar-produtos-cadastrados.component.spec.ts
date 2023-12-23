import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarProdutosCadastradosComponent } from './listar-produtos-cadastrados.component';

describe('ListarProdutosCadastradosComponent', () => {
  let component: ListarProdutosCadastradosComponent;
  let fixture: ComponentFixture<ListarProdutosCadastradosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarProdutosCadastradosComponent]
    });
    fixture = TestBed.createComponent(ListarProdutosCadastradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
