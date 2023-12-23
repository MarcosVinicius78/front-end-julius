import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio-painel',
  templateUrl: './inicio-painel.component.html',
  styleUrls: ['./inicio-painel.component.css']
})
export class InicioPainelComponent implements OnInit {

  diario: string = "10.000"
  mensal: string = "100.000"
  total: string = "1.000.000"

  constructor() { }

  ngOnInit() {
  }

}
