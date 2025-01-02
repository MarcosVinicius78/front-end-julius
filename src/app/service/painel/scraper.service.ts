import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScraperService {

  apiUrl = environment.apiUrl

  constructor(
    private http: HttpClient
  ) { }

  ativarBot(valor: boolean){
    return this.http.get(`${this.apiUrl}/scraper/ativarBot?ativar=${valor}`)
  }

  statusBot(): Observable<boolean>{
    return this.http.get<boolean>(`${this.apiUrl}/scraper/statusBot`);
  }

  mudarTempoDoRobo(tempo: number){
    return this.http.get(`${this.apiUrl}/scraper/mudar-tempo-do-robo?tempo=${tempo}`);
  }

  buscarTempoDoRobo(){
    return this.http.get<number>(`${this.apiUrl}/scraper/buscar-tempo-do-robo`);
  }
}
