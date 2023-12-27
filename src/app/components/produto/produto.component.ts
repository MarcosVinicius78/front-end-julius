import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProdutoLoja } from 'src/app/dto/ProdutoLoja';
import { Produtos } from 'src/app/models/produtos';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { Meta } from '@angular/platform-browser';
import { ReportService } from 'src/app/service/painel/report.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit{

  modal = false;

  id!: string;

  // produtos: Produtos[] = [];

  produto = new ProdutoLoja;

  constructor(private route: ActivatedRoute, private produtoService: ProdutoService, private meta: Meta, private reportService: ReportService){}

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

    // const mensagem = `*${this.produto.titulo}*\n\n*Por: R$ ${this.produto.preco}*\nConfira aqui: ${window.location.href}`;

    // navigator.share({
    //   title: this.produto.titulo,
    //   text: mensagem,
    //   url: window.location.href
    // }).then(() => console.log('Compartilhado com sucesso'))
    // .catch((error) => console.error('Erro ao compartilhar:', error));


  }

  // montarEstruturaCompartilhamento() {
  //   let estruturaCompartilhamento = `Título: ${this.produto.titulo}\n`;
  //   estruturaCompartilhamento += `Preço: ${this.produto.preco}\n`;
  //   estruturaCompartilhamento += `Link: ${this.produto.link}\n`;

  //   if (this.produto.cupom) {
  //     estruturaCompartilhamento += `Cupom: ${this.produto.cupom}\n`;
  //   }

  //   if (this.produto.freteVariacoes) {
  //     estruturaCompartilhamento += `Frete: ${this.produto.freteVariacoes}\n`;
  //   }

  //   if (this.produto.mensagemAdicional) {
  //     estruturaCompartilhamento += `${this.produto.mensagemAdicional}\n`;
  //   }

  //   console.log(estruturaCompartilhamento);
  // }

  private setProductMetaTags(productName: string, productDescription: string, productImageUrl: string): void {
    // Limpa todas as tags meta existentes
    // this.meta.removeTag('name="description"');
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('property="og:description"');
    // this.meta.removeTag('property="og:image"');

    // Adiciona as novas tags meta
    // this.meta.addTag({ name: 'description', content: productDescription });
    this.meta.addTag({ property: 'og:title', content: productName });
    this.meta.addTag({ property: 'og:description', content: productDescription });
    // this.meta.addTag({ property: 'og:image', content: this.produto.imagem });
  }

  fecharModal(){
    this.modal = false;
  }

  abrirModal(){
    this.modal = true;
  }

  impedirFechar(event: Event) {
    event.stopPropagation();
  }

  reportar(productId: number, reportType: string) {
    this.reportService.reportar(productId, reportType).subscribe(response => {
      this.fecharModal()
    });
  }
}
