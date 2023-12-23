import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProdutoLoja } from 'src/app/dto/ProdutoLoja';
import { Produtos } from 'src/app/models/produtos';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  salvarLoja(produto: any){

    return this.http.post<Produtos>(`${this.apiUrl}/produto`, produto);
  }

  listarProduto(page: number, size: number): Observable<any>{

    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<PordutosPage>(`${this.apiUrl}/produto`, { params });
  }

  pegarProduto(id: any) {
    return this.http.get<ProdutoLoja>(`${this.apiUrl}/produto/${id}`);
  }

  atualizarProduto(produto: any) {
    return this.http.put(`${this.apiUrl}/produto`, produto);
  }

  apagarProduto(id: number) {
    return this.http.delete(`${this.apiUrl}/produto/${id}`);
  }

  obeterProdutoPorCategoria(categoriaId: number){

    console.log(categoriaId)

    const params = new HttpParams().set('categoriaId', categoriaId.toString());

    return this.http.get<any>(`${this.apiUrl}/produto/por-categoria`, { params })
  }

  ProdutoPorCategoria(categoriaId: any, page: number, size: number){

    const params = new HttpParams().set('categoriaId', categoriaId.toString()).set('page', page.toString()).set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/produto/por-categoria`, { params })
  }

  apagarVariosProdutos(produtosSelecionados: number[]){
    return this.http.post<number>(`${this.apiUrl}/produto/apagar-varios`, produtosSelecionados)
  }
}

interface PordutosPage{
  content: Produtos[],
  totalElements: number,
  totalPages: number
}
