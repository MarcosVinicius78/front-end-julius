import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../../models/categoria';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {


  URL_BASE = environment.apiUrl;

  constructor(private http: HttpClient) { }

  salvarCategoria(categoria: Categoria){
    return this.http.post<Categoria>(`${this.URL_BASE}/categoria`, categoria);
  }

  listarCategoria(){
    return this.http.get<CategoriaPage>(`${this.URL_BASE}/categoria`);
  }

  apagarCategoria(id: number) {
    return this.http.delete(`${this.URL_BASE}/categoria/${id}`)
  }

  pegarCategoria(id: number) {
    return this.http.get<Categoria>(`${this.URL_BASE}/categoria/${id}`)
  }

  atualizarCategoria(categoria: any) {
    return this.http.put(`${this.URL_BASE}/categoria`, categoria);
  }
}

interface CategoriaPage {
  content: Categoria[],
  totalElements: number,
  totalPages: number
}
