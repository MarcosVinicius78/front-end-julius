import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarPostsComponent } from './cadastrar-posts.component';

describe('CadastrarPostsComponent', () => {
  let component: CadastrarPostsComponent;
  let fixture: ComponentFixture<CadastrarPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastrarPostsComponent]
    });
    fixture = TestBed.createComponent(CadastrarPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
