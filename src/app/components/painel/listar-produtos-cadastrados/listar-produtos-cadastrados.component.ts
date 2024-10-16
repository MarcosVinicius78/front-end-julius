import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { Produtos } from 'src/app/models/produtos';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { isPlatformBrowser } from '@angular/common';
import { FormControl } from '@angular/forms';
import { debounceTime, map, switchMap } from 'rxjs';
import { response } from 'express';


@Component({
  selector: 'app-listar-produtos-cadastrados',
  templateUrl: './listar-produtos-cadastrados.component.html',
  styleUrls: ['./listar-produtos-cadastrados.component.scss'],
  providers: [MessageService]
})
export class ListarProdutosCadastradosComponent implements OnInit {

  page = 0;
  size = 10;
  selectAllCheckbox = false;

  items: MenuItem[] | undefined;

  totalPage!: number

  number!: number

  produtos: Produtos[] = [];

  termoPesquisa = new FormControl();
  palavra: string = "";

  // produto!: Produtos;
  selectedProducts!: Produtos;

  openMenuId: number | null = null;

  constructor(
    private produtoService: ProdutoService,
    private route: Router,
    private messageService: MessageService,
    private clipboard: Clipboard,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.listarProdutos();

    this.items = [
      {
        label: 'Apagar',
        icon: 'pi pi-trash',
      },
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
      },
      {
        label: 'Promocao Encerrada',
        icon: 'pi pi-fw pi-user',
      },
    ];

    this.termoPesquisa.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((termo: string) => this.pesquisar(termo))
      )
      .subscribe(resultados => {

      });
  }

  listarProdutos() {
    this.produtoService.listarProduto(this.page, this.size).subscribe(response => {
      this.produtos = this.produtos.concat(response.content)
      this.totalPage = response.totalPages
    });
  }

  changePage(page: any) {
    this.page = page.page

    if (this.palavra === "") {
      this.produtoService.listarProduto(this.page, this.size).subscribe((response: any) => {
        this.produtos = response.content
      });
    } else {
      this.pesquisar(this.palavra);
    }
  }

  apagarProduto(id: number, urlImagem: string, imagemSocial: string) {
    this.produtoService.apagarProduto(id, urlImagem, imagemSocial).subscribe(response => {
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

  apagarVariosProdutos() {

    this.produtoService.apagarVariosProdutos(this.selectedProducts).subscribe(response => {
      this.produtos = [];
      this.messageService.add({ severity: 'success', detail: 'Produtos Apagados' });
      this.listarProdutos();
    }, err => {
      this.messageService.add({ severity: 'error', detail: 'Erro ao Apagar' });
    });
  }

  copiarParaAreaTransferenciaLink(link: string) {
    this.clipboard.copy(link);
  }

  gerarStory(preco: string, titulo: string, urlImagem: string, frete: string, cupom: string, link: string) {

    this.copiarParaAreaTransferenciaLink(link);

    this.produtoService.gerarStory(preco, titulo, urlImagem, frete, cupom).subscribe(response => {

      if (isPlatformBrowser(this.platformId)) {
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
      }
    }, err => {
      this.messageService.add({ severity: 'error', detail: 'Erro ao Gerar Storie' });
    })
  }

  gerarFeed(id: number) {

    console.log(this.selectedProducts);

    this.produtoService.gerarFeed(id).subscribe(response => {
      if (isPlatformBrowser(this.platformId)) {
        // Cria um URL para a Blob response
        const url = window.URL.createObjectURL(response.body!);

        // Cria um link temporário e simula um clique para iniciar o download
        const link = document.createElement('a');
        link.href = url;
        link.download = "teste";
        document.body.appendChild(link);
        link.click();

        // Limpa o URL criado
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }
    }, err => {
      this.messageService.add({ severity: 'error', detail: 'Erro ao Gerar Storie' });
    })
  }

  copiarParaAreaTransferencia(produtos: Produtos, valor: number) {

    let post = this.montarEstruturaCompartilhamento(produtos)

    if (valor === 1) {
      this.clipboard.copy(post);
    } else {
      post = post.replace(/_/g, '__');
      post = post.replace(/\*/g, '**');
      this.clipboard.copy(post);
    }
    this.messageService.add({ severity: 'success', detail: 'POST COPIADO' });
  }

  montarEstruturaCompartilhamento(produto: Produtos) {


    let estruturaCompartilhamento = "";

    if (produto.copy) {
      estruturaCompartilhamento += `*${produto.copy}*\n\n`
    }

    if (produto.copy.length === 0 && produto.titulo.length > 55) {
      estruturaCompartilhamento += `\u{1F4CC} ${produto.titulo.substring(0, 60)}...\n\n`;
    } else if (produto.copy.length === 0) {
      estruturaCompartilhamento += `\u{1F4CC} ${produto.titulo}\n\n`;
    }

    if (produto.freteVariacoes.includes("CUPOM")) {
      estruturaCompartilhamento += `*\u{1F525} ${produto.preco} (Frete Grátis)*\n`;
    } else if (produto.parcelado && produto.parcelado.toLocaleLowerCase().includes("sem juros")) {
      estruturaCompartilhamento += `*\u{1F525} ${produto.preco} (Parcelado)*\n`;
    } else {
      estruturaCompartilhamento += `*\u{1F525} ${produto.preco}* à vista\n`;
    }

    if (produto.cupom && produto.cupom.length < 20) {
      estruturaCompartilhamento += `\u{1F39F} Use o Cupom: *${produto.cupom}*\n`;
    } else if (produto.cupom) {
      estruturaCompartilhamento += `_\u{1F5E3} ${produto.cupom}_\n`;
    }

    if (isPlatformBrowser(this.platformId)) {


      if (this.route.url === "/painel" && (produto.loja.nome_loja.includes("Amazon") || produto.loja.nome_loja.includes("Mercado"))) {
        estruturaCompartilhamento += `\n*\u{1F6D2} Confira Aqui:\u{1F447}*\n${window.location.href.replace("painel", '')}oferta/${produto.id}`;
        alert("d")
      } else if( produto.loja.nome_loja.includes("Amazon") || produto.loja.nome_loja.includes("Mercado Livre")){
        estruturaCompartilhamento += `\n*\u{1F6D2} Confira Aqui:\u{1F447}*\n${window.location.href.replace("painel/listar-produtos", '')}oferta/${produto.id}`;
      }else if (this.route.url === "/painel") {
        estruturaCompartilhamento += `\n*\u{1F6D2} Confira Aqui:\u{1F447}*\n${window.location.href.replace("painel", '')}oferta/${produto.id}?r=1`;
      } else {
        estruturaCompartilhamento += `\n*\u{1F6D2} Confira Aqui:\u{1F447}*\n${window.location.href.replace("painel/listar-produtos", '')}oferta/${produto.id}?r=1`;
      }

    }

    if (produto.freteVariacoes.includes("CUPOM")) {
      estruturaCompartilhamento += `\n\n\u{1F4E6} ${produto.freteVariacoes}`;
    }

    if (produto.mensagemAdicional) {
      estruturaCompartilhamento += `\n\n_${produto.mensagemAdicional}_`;
    }

    return estruturaCompartilhamento;
  }

  toggleMenu(productId: number) {
    if (this.openMenuId === productId) {
      this.openMenuId = null;
    } else {
      this.openMenuId = productId;
    }
  }

  pesquisar(termo: string) {
    this.palavra = termo;

    // return this.produtoService.pesquisarProdutos(termo, this.page, this.size)
    // .pipe(
    //   map( data => data)
    // );

    this.produtoService.pesquisarProdutos(termo, this.page, this.size).subscribe(
      data => {
        this.totalPage = data.totalPages
        this.produtos = data.content;
        // this.loading = false;
        // this.termoPesquisaAnterior = this.termoPesquisa;
        // console.log(data)
      });

    return this.produtos
  }
}
