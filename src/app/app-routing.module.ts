import { LinksBannersComponent } from './components/painel/links-banners/links-banners.component';
import { ProdutoComponent } from './components/produto/produto.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarProdutosComponent } from './components/listar-produtos/listar-produtos.component';
import { InicioPainelComponent } from './components/painel/inicio-painel/inicio-painel.component';
import { CadastrarProdutoComponent } from './components/painel/cadastrar-produto/cadastrar-produto.component';
import { ListarProdutosCadastradosComponent } from './components/painel/listar-produtos-cadastrados/listar-produtos-cadastrados.component';
import { CadastrarCategoriaComponent } from './components/painel/cadastrar-categoria/cadastrar-categoria.component';
import { CadastrarLojaComponent } from './components/painel/cadastrar-loja/cadastrar-loja.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { ReportComponent } from './components/painel/report/report.component';

const routes: Routes = [
  { path: 'painel', component: InicioPainelComponent, children: [
    { path: '', component: ListarProdutosCadastradosComponent},
    { path: 'cadastrar-produtos', component: CadastrarProdutoComponent},
    { path: 'atualizar-produtos/:id', component: CadastrarProdutoComponent},
    { path: 'listar-produtos', component: ListarProdutosCadastradosComponent},
    { path: 'cadastrar-categoria', component: CadastrarCategoriaComponent},
    { path: 'cadastrar-loja', component: CadastrarLojaComponent},
    { path: 'report', component: ReportComponent},
    { path: 'links-banners', component: LinksBannersComponent},
  ], data: { hideHeader: false, hideFooter: false }},
  { path: '', component: ListarProdutosComponent, data: { hideHeader: true, hideFooter: true }},
  { path:  'oferta/:id', component: ProdutoComponent, data: { hideHeader: true, hideFooter: true }},
  { path:  'produtos-categoria/:id', component: ListarProdutosComponent, data: { hideHeader: true, hideFooter: true }},
  { path:  'grupos', component: GruposComponent, data: { hideHeader: true, hideFooter: true }},
  // { path: '', redirectTo: '/inicio', pathMatch: 'full'},
  // { path: '**', redirectTo: 'inicio', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
