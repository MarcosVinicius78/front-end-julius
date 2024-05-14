import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loja } from '../../models/loja';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LojaService {

  URL_BASE = environment.apiUrl;;

  constructor(private http: HttpClient) { }

  salvarLoja(loja: FormData){

    return this.http.post(`${this.URL_BASE}/loja`, loja);
  }

  listarLojas(): Observable<any>{
    return this.http.get<any>(`${this.URL_BASE}/loja`);
  }

  pegarLoja(id: string){
    return this.http.get<any>(`${this.URL_BASE}/loja/${id}`)
  }

  apagarLoja(id: number, urlImagem: string){
    const params = new HttpParams().set('id', id.toString()).set('urlImagem', urlImagem);
    return this.http.delete(`${this.URL_BASE}/loja`, { params });
  }

  atualizarLoja(fomrData: FormData){
    return this.http.put(`${this.URL_BASE}/loja`, fomrData);
  }
}
