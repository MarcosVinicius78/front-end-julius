import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Produtos } from 'src/app/models/produtos';
import { ProdutoService } from 'src/app/service/painel/produto.service';

@Component({
  selector: 'app-listar-produtos-cadastrados',
  templateUrl: './listar-produtos-cadastrados.component.html',
  styleUrls: ['./listar-produtos-cadastrados.component.css'],
  providers: [MessageService]
})
export class ListarProdutosCadastradosComponent implements OnInit{

  page = 0;
  size = 10;
  selectAllCheckbox = false;

  totalPage!: number

  number!: number

  produtos: Produtos[] = [];

  produto!: Produtos;
  selectedProducts!: Produtos;

  constructor(
    private produtoService: ProdutoService,
    private route: Router,
    private messageService: MessageService
  ){}

  ngOnInit(): void {
    this.listarProdutos();
  }

  listarProdutos(){
    this.produtoService.listarProduto(this.page, this.size).subscribe( response => {
      this.produtos = this.produtos.concat(response.content)
      this.totalPage = response.totalPages
    });
  }

  changePage(page: any) {
    this.page = page.page
    this.produtoService.listarProduto(this.page, this.size).subscribe( (response: any) => {
      this.produtos = response.content
    });
  }

  apagarProduto(id: number, urlImagem: string) {
    this.produtoService.apagarProduto(id,urlImagem).subscribe(response => {
      this.messageService.add({ severity: 'success', detail: 'Produto Apagado' });
      this.produtos = [];
      this.listarProdutos();
    }, err => {
      this.produtos = [];
      this.listarProdutos();
      this.messageService.add({ severity: 'error', detail: 'Erro ao Apagar' });
      console.log(err);
    });
  }

  apagarVariosProdutos(){

    console.log(this.selectedProducts)

    this.produtoService.apagarVariosProdutos(this.selectedProducts).subscribe(response => {
      this.produtos = [];
      this.messageService.add({ severity: 'success', detail: 'Produtos Apagados' });
      this.listarProdutos();
    }, err => {
      this.messageService.add({ severity: 'error', detail: 'Erro ao Apagar' });
    });
  }

  gerarStory(preco: string, titulo: string, urlImagem: string, frete: string, cupom: string){
    this.produtoService.gerarStory(preco, titulo, urlImagem, frete, cupom).subscribe(response => {

      console.log(response)
      // const contentDisposition = response.headers.get('content-disposition');
      // const fileName = contentDisposition!.split(';')[1].split('=')[1].trim();

      // Cria um URL para a Blob response
      const url = window.URL.createObjectURL(response.body!);

      // Cria um link temporário e simula um clique para iniciar o download
      const link = document.createElement('a');
      link.href = url;
      link.download = titulo;
      document.body.appendChild(link);
      link.click();

      // Limpa o URL criado
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    })
  }
}
