import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PrmomsProdutos, Promos, PromoSalvar } from 'src/app/models/promos';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromosService {

  api = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }


  listarPromos(page: number, size: number){
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<PromosPage>(`${this.api}/promos`, { params })
  }

  pegarPromo(id: string){
    return this.http.get<PrmomsProdutos>(`${this.api}/promos/${id}`)
  }

  salvarPromo(promoSalvar: PromoSalvar){
    return this.http.post<PrmomsProdutos>(`${this.api}/promos/salvar`, promoSalvar);
  }

  apagarPromo(id:number, urlImagem: string){
    return this.http.delete(`${this.api}/promos?id=${id}&urlImagem=${urlImagem}`)
  }

  apagarPromoProduto(idEditar:number,id: number){
    return this.http.delete(`${this.api}/promos/produto?id=${id}&idEditar=${idEditar}`)
  }

  atualizarPromo(promoSalvar: PromoSalvar){
    return this.http.put(`${this.api}/promos`, promoSalvar);
  }

  salvarImagem(formData: FormData) {
    return this.http.post(`${this.api}/promos/upload`, formData);
  }
}

interface PromosPage {
  content: PrmomsProdutos[],
  totalElements: number,
  totalPages: number
}
