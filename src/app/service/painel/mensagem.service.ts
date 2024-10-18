import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MensagemService {

  apiUrl = environment.apiUrl

  constructor(
    private http: HttpClient
  ) { }

  enviarTelegram(mensagem: any){
    return this.http.post(`${this.apiUrl}/mensagem/telegram`, mensagem)
  }

}
