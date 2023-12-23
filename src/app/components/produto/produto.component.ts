import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProdutoLoja } from 'src/app/dto/ProdutoLoja';
import { Produtos } from 'src/app/models/produtos';
import { ProdutoService } from 'src/app/service/painel/produto.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit{

  id!: string;

  produtos: Produtos[] = [];

  produto = new ProdutoLoja;

  constructor(private route: ActivatedRoute, private produtoService: ProdutoService){}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.pegarProduto()
  }

  pegarProduto(){
    this.produtoService.pegarProduto(this.id).subscribe( response => {
      this.produto = response;
    });
  }

  compartilhar() {

    const mensagem = `*${this.produto.titulo}*\n\n*Por: R$ ${this.produto.preco}*\nConfira aqui: ${"www.google.com.br"}\n${this.produto.imagem}`;

    navigator.share({
      title: this.produto.titulo,
      text: mensagem,
      url: window.location.href
    }).then(() => console.log('Compartilhado com sucesso'))
    .catch((error) => console.error('Erro ao compartilhar:', error));
  }



}
