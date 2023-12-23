import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ListarProdutosComponent } from './components/listar-produtos/listar-produtos.component';
import { InicioPainelComponent } from './components/painel/inicio-painel/inicio-painel.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuLateralComponent } from './components/painel/menu-lateral/menu-lateral.component';
import { CadastrarProdutoComponent } from './components/painel/cadastrar-produto/cadastrar-produto.component';
import { ListarProdutosCadastradosComponent } from './components/painel/listar-produtos-cadastrados/listar-produtos-cadastrados.component';
import { CadastrarCategoriaComponent } from './components/painel/cadastrar-categoria/cadastrar-categoria.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastrarLojaComponent } from './components/painel/cadastrar-loja/cadastrar-loja.component';
import { ProdutoComponent } from './components/produto/produto.component';
import { PaginatorComponentComponent } from './components/painel/paginator-component/paginator-component.component';
import { CarrosselComponent } from './components/carrossel/carrossel.component';
import { GruposComponent } from './components/grupos/grupos.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ListarProdutosComponent,
    InicioPainelComponent,
    FooterComponent,
    MenuLateralComponent,
    CadastrarProdutoComponent,
    ListarProdutosCadastradosComponent,
    CadastrarCategoriaComponent,
    CadastrarLojaComponent,
    ProdutoComponent,
    PaginatorComponentComponent,
    CarrosselComponent,
    GruposComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
