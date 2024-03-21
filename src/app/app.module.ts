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
import { HttpClientModule, HttpClient, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastrarLojaComponent } from './components/painel/cadastrar-loja/cadastrar-loja.component';
import { ProdutoComponent } from './components/produto/produto.component';
import { CarrosselComponent } from './components/carrossel/carrossel.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { ReportComponent } from './components/painel/report/report.component';
import { LinksBannersComponent } from './components/painel/links-banners/links-banners.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginComponent } from './components/painel/login/login.component';
import { RequireService } from './interceptors/require.service';
import { AuthRouteguard } from './routeguard/auth-routeguard.service';
import {MatPaginatorModule} from '@angular/material/paginator';


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
    CarrosselComponent,
    GruposComponent,
    ReportComponent,
    LinksBannersComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequireService,
      multi: true
    },
    AuthRouteguard],
  bootstrap: [AppComponent]
})
export class AppModule { }
