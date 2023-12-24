import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProdutoLoja } from 'src/app/dto/ProdutoLoja';
import { Produtos } from 'src/app/models/produtos';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit{

  id!: string;

  produtos: Produtos[] = [];

  produto = new ProdutoLoja;

  constructor(private route: ActivatedRoute, private produtoService: ProdutoService, private meta: Meta){}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.pegarProduto();
  }

  pegarProduto(){
    this.produtoService.pegarProduto(this.id).subscribe( response => {
      this.produto = response;
      this.setProductMetaTags(this.produto.titulo, this.produto.descricao,  window.location.href);
    });
  }

  compartilhar() {

    const mensagem = `*${this.produto.titulo}*\n\n*Por: R$ ${this.produto.preco}*\nConfira aqui: ${window.location.href}`;

    navigator.share({
      title: this.produto.titulo,
      text: mensagem,
      url: window.location.href
    }).then(() => console.log('Compartilhado com sucesso'))
    .catch((error) => console.error('Erro ao compartilhar:', error));
  }

  private setProductMetaTags(productName: string, productDescription: string, productImageUrl: string): void {
    // Limpa todas as tags meta existentes
    this.meta.removeTag('name="description"');
    this.meta.removeTag('name="og:title"');
    this.meta.removeTag('name="og:description"');
    this.meta.removeTag('name="og:image"');

    // Adiciona as novas tags meta
    this.meta.addTag({ name: 'description', content: productDescription });
    this.meta.addTag({ property: 'og:title', content: productName });
    this.meta.addTag({ property: 'og:description', content: productDescription });
    this.meta.addTag({ property: 'og:image', content: this.produto.imagem });
  }
}
