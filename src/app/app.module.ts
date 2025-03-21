import { GrupoSeComponent } from './components/grupo-se/grupo-se.component';
import { MenuOpcoesComponent } from './components/painel/listar-produtos-cadastrados/components/menuOpcoes/menuOpcoes.component';
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

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
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastrarLojaComponent } from './components/painel/cadastrar-loja/cadastrar-loja.component';
import { ProdutoComponent } from './components/produto/produto.component';
import { CarrosselComponent } from './components/carrossel/carrossel.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { ReportComponent } from './components/painel/report/report.component';
import { LinksBannersComponent } from './components/painel/links-banners/links-banners.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { LoginComponent } from './components/painel/login/login.component';
import { RequireService } from './interceptors/require.service';
import { AuthRouteguard } from './routeguard/auth-routeguard.service';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { BlogComponent } from './components/blog/blog.component';
import { CadastrarPostsComponent } from './components/painel/cadastrar-posts/cadastrar-posts.component';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { MessagesModule } from 'primeng/messages';
import { ListaDePostsComponent } from './components/painel/lista-de-posts/lista-de-posts.component';
import { CardModule } from 'primeng/card';
import { ConfiguracoesComponent } from './components/painel/configuracoes/configuracoes.component';
import { BlankComponent } from './components/blank/blank.component';
import { CadastrarPromoComponent } from './components/painel/cadastrar-promo/cadastrar-promo.component';
import { DialogModule } from 'primeng/dialog';
import { PickListModule } from 'primeng/picklist';
import { PromosComponent } from './components/promos/promos.component';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PesquisaComponent } from './components/pesquisa/pesquisa.component';
import { CarouselModule } from 'primeng/carousel';
import { FormatRealPipe } from "./pipe/format-real.pipe";
import { FormatTextPipe } from './pipe/format-text.pipe';
import { ParceirosComponent } from './components/parceiros/parceiros.component';
import { ChartModule } from 'primeng/chart';

import { RouterModule } from '@angular/router';
import { ImageDisplayComponent } from "./common/image-display/image-display.component";
import { ProdutoCardComponent } from './common/produto-card/produto-card.component';

import { PanelMenuModule } from 'primeng/panelmenu';

@NgModule({ declarations: [
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
        LoginComponent,
        BlogComponent,
        CadastrarPostsComponent,
        ListaDePostsComponent,
        ConfiguracoesComponent,
        BlankComponent,
        MenuOpcoesComponent,
        CadastrarPromoComponent,
        PromosComponent,
        ProdutoCardComponent,
        GrupoSeComponent,
        PesquisaComponent,
        ParceirosComponent,
        ImageDisplayComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
    AppRoutingModule,
    PanelMenuModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ButtonModule,
    ChartModule,
    TableModule,
    ToastModule,
    EditorModule,
    FileUploadModule,
    ToolbarModule,
    RouterModule,
    PaginatorModule,
    InputTextModule,
    DropdownModule,
    MessagesModule,
    DialogModule,
    PickListModule,
    InputIconModule,
    IconFieldModule,
    InputSwitchModule,
    CarouselModule,
    CardModule, FormatRealPipe, FormatTextPipe], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RequireService,
            multi: true
        },
        AuthRouteguard,
        provideHttpClient(withInterceptorsFromDi(), withXsrfConfiguration({
            cookieName: 'XSRF-TOKEN',
            headerName: 'X-XSRF-TOKEN'
        })),
        provideClientHydration()
    ] })
export class AppModule { }
