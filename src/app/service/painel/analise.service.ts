import { TotalDeAcessosPorCategoria } from './../../dto/evento/TotalDeAcessosPorCategoria';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { EventoQuantidadePorTipo } from 'src/app/dto/evento/EventoQuantidadePorTipo';
import { TotalDeAcessos } from 'src/app/dto/evento/TotalDeAcessos';
import { TotalDeAcessosPorLoja } from 'src/app/dto/evento/TotalDeAcessosPorLoja';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnaliseService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  registrarEvento(tipo: string, detalhes?: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/eventos/registrar`, null, {
      params: { tipo, detalhes: detalhes || '' }
    });
  }
  
  registrarEventoDoProduto(id: number, tipo: string, detalhes?: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/eventos/registrar-produto/${id}`, null, {
      params: { tipo, detalhes: detalhes || '' }
    });
  }

  obterPorcentagemCliquesNaoCliques(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/eventos/porcentagem-cliques-nao-cliques`);
  }

  listarProdutosComMaisCliques(termo?: string, data?: string) {
    const termoFinal = termo ?? "";
    return this.http.get<any>(`${this.apiUrl}/eventos/listar-produtos-com-mais-cliques?termo=${encodeURIComponent(termoFinal)}&data=${encodeURIComponent(data!)}`);
  }
  

  obterAcessosSemana(inicioSemana: string, fimSemana: string): Observable<any> {

    const params = new HttpParams()
      .set('inicioSemana', inicioSemana)
      .set('fimSemana', fimSemana);

    return this.http.get<any>(`${this.apiUrl}/eventos/acessos-semana`, { params });
  }

  //usando
  totalDeAcessosNoSitema(){
    return this.http.get<TotalDeAcessos>(`${this.apiUrl}/eventos/total-de-acessos`);
  }

  //usando
  buscarEventosPorDia(data: string, tipoEvento: string) {

    const params = new HttpParams()
      .set('data', data)
      .set('tipoEvento', tipoEvento);

    return this.http.get<EventoQuantidadePorTipo>(`${this.apiUrl}/eventos/buscar-por-dia`, { params });
  }

  totalDeAcessosPorLoja(data: string) {
    return this.http.get<TotalDeAcessosPorLoja[]>(`${this.apiUrl}/eventos/total-de-acessos-por-loja?data=${data}`);
  }

  totalDeAcessosPorCategoria(data: string) {
    return this.http.get<TotalDeAcessosPorCategoria[]>(`${this.apiUrl}/eventos/total-de-acessos-por-categoria?data=${data}`);
  }
}
