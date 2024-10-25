import { filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { serialize } from 'v8';

@Injectable({
  providedIn: 'root'
})
export class SearchStorageService {

  private readonly pesquisaRecente = "pesquisaRecente";
  private readonly maximoIntesNaPesquisa = 5;

  constructor() { }

  adicionarPesquisa(termoPesquisa: string){
    let pesquisas = this.pegarPesquisaRecente();

    pesquisas = pesquisas.filter((pesquisa: string) => pesquisa != termoPesquisa);

    pesquisas.unshift(termoPesquisa);

    if (pesquisas.length > this.maximoIntesNaPesquisa) {
      pesquisas = pesquisas.slice(0, this.maximoIntesNaPesquisa)
    }

    localStorage.setItem(this.pesquisaRecente, JSON.stringify(pesquisas));
  }

  pegarPesquisaRecente(){
    const pesquisa = localStorage.getItem(this.pesquisaRecente);

    return pesquisa ? JSON.parse(pesquisa) : [];
  }

  limparPesquisa(){
    localStorage.removeItem(this.pesquisaRecente);
  }
}
