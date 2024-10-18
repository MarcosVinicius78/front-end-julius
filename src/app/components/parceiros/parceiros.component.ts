import { Component, OnInit } from '@angular/core';
import { Loja } from 'src/app/models/loja';
import { LojaService } from 'src/app/service/painel/loja.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-parceiros',
  templateUrl: './parceiros.component.html',
  styleUrls: ['./parceiros.component.scss']
})
export class ParceirosComponent implements OnInit {

  lojas: Loja[] = []

  apiUrl = environment.apiUrl

  constructor(
    private lojaService: LojaService
  ) { }

  ngOnInit() {
    this.listarLojas()
  }

  listarLojas(){
    this.lojaService.listarLojas().subscribe(response => {
      this.lojas = response
    })
  }

}
