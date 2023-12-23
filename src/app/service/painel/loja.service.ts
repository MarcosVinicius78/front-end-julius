import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loja } from '../../models/loja';

@Injectable({
  providedIn: 'root'
})
export class LojaService {

  URL_BASE: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  salvarLoja(loja: any){

    return this.http.post("http://localhost:8080/loja", loja);
  }

  listarLojas(): Observable<any>{
    return this.http.get<any>(`${this.URL_BASE}/loja`);
  }
}
