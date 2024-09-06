import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtivarRodapéService {
  private rodape = new BehaviorSubject<boolean>(false);
  rodapeAtivo$ = this.rodape.asObservable();

  constructor() { }

  ativarRodape(valor: boolean){
    this.rodape.next(valor);
  }

}
