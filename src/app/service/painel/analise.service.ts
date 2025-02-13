import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { EventoQuantidadePorTipo } from 'src/app/dto/evento/EventoQuantidadePorTipo';
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

  obterEstatisticas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/eventos/estatisticas`);
  }

  obterPorcentagemCliquesNaoCliques(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/eventos/porcentagem-cliques-nao-cliques`);
  }

  listarProdutosComMaisCliques() {
    return this.http.get<any>(`${this.apiUrl}/eventos/listar-produtos-com-mais-cliques`);
  }

  obterAcessosSemana(inicioSemana: string, fimSemana: string): Observable<any> {

    const params = new HttpParams()
      .set('inicioSemana', inicioSemana)
      .set('fimSemana', fimSemana);

    return this.http.get<any>(`${this.apiUrl}/eventos/acessos-semana`, { params });
  }

  buscarEventosPorDia(data: string, tipoEvento: string) {

    const params = new HttpParams()
      .set('data', data)
      .set('tipoEvento', tipoEvento);

    return this.http.get<EventoQuantidadePorTipo>(`${this.apiUrl}/eventos/buscar-por-dia`, { params });
  }
}
