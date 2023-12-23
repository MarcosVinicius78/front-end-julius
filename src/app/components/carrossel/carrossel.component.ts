import { Component, ElementRef, ViewChild } from '@angular/core';
import { Produtos } from 'src/app/models/produtos';
import { ProdutoService } from 'src/app/service/painel/produto.service';

@Component({
  selector: 'app-carrossel',
  templateUrl: './carrossel.component.html',
  styleUrls: ['./carrossel.component.css']
})
export class CarrosselComponent {

  currentIndex = 0;

  page = 0;
  size = 10;

  produtos: Produtos[] = [];

  constructor(private produtoService: ProdutoService){}

  ngOnInit() {
    this.obeterProdutoPorCategoria()
  }

  obeterProdutoPorCategoria(){
    this.produtoService.obeterProdutoPorCategoria(4).subscribe((response: any) => {
      this.produtos = response;
    })
  }

}
