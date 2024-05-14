import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProdutoLoja } from 'src/app/dto/ProdutoLoja';
import { ScraperProduto } from 'src/app/dto/ScraperProduto';
import { Produtos } from 'src/app/models/produtos';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  salvarProduto(produto: any) {

    return this.http.post<Produtos>(`${this.apiUrl}/produto/salvar`, produto);
  }

  salvarImagem(formData: FormData) {
    return this.http.post(`${this.apiUrl}/produto/upload`, formData);
  }

  listarProduto(page: number, size: number): Observable<any> {

    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<PordutosPage>(`${this.apiUrl}/produto`, { params });
  }

  pegarProduto(id: any) {
    return this.http.get<ProdutoLoja>(`${this.apiUrl}/produto/${id}`);
  }

  atualizarProduto(produto: any) {
    return this.http.put(`${this.apiUrl}/produto`, produto);
  }

  apagarProduto(id: number, urlImagem: string) {
    const params = new HttpParams().set('id', id.toString()).set('urlImagem', urlImagem)
    return this.http.delete(`${this.apiUrl}/produto`, { params });
  }

  obeterProdutoPorCategoria() {

    return this.http.get<any>(`${this.apiUrl}/produto`)
  }

  ProdutoPorCategoria(categoriaId: any, page: number, size: number) {

    const params = new HttpParams().set('categoriaId', categoriaId.toString()).set('page', page.toString()).set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/produto/por-categoria`, { params })
  }

  apagarVariosProdutos(produtosSelecionados: Produtos) {
    return this.http.post<number>(`${this.apiUrl}/produto/apagar-varios`, produtosSelecionados)
  }

  pesquisarProdutos(termoPesquisa: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/produto/pesquisar?termoPesquisa=${termoPesquisa}`);
  }

  rasparProduto(link: string) {
    return this.http.get<ScraperProduto>(`${this.apiUrl}/scraper?url=${link}`);
  }

  gerarStory(preco: string, titulo: string, urlImagem: string, frete: string, cupom: string) {

    const params = new HttpParams().set('preco', preco.toString()).set('titulo', titulo.toString()).set('urlImagem', urlImagem).set('frete', frete).set('cupom', cupom);

    return this.http.get(`${this.apiUrl}/produto/generate-image`, { params, responseType: 'blob', observe: 'response' });
  }
}

interface PordutosPage {
  content: Produtos[],
  totalElements: number,
  totalPages: number
}
