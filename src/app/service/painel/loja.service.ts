import { HttpClient } from '@angular/common/http';
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

  salvarLoja(loja: any){

    return this.http.post(`${this.URL_BASE}/loja`, loja);
  }

  listarLojas(): Observable<any>{
    return this.http.get<any>(`${this.URL_BASE}/loja`);
  }
}
