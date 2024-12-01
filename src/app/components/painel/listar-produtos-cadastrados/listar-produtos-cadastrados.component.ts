import { FormatRealPipe } from './../../../pipe/format-real.pipe';
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
import { environment } from 'src/environments/environment';
import { MensagemService } from 'src/app/service/painel/mensagem.service';
import { Categoria } from 'src/app/models/categoria';
import { Loja } from 'src/app/models/loja';
import { LojaService } from 'src/app/service/painel/loja.service';
import { CategoriaService } from 'src/app/service/painel/categoria.service';


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
  produto = new Produtos();

  apiUrl = environment.apiUrl;

  termoPesquisa = new FormControl();
  palavra: string = "";

  idCategoria: string = ""

  categorias!: Categoria[];
  lojas!: Loja[];

  // produto!: Produtos;
  selectedProducts!: Produtos;

  openMenuId: number | null = null;

  visible: boolean = false;

  constructor(
    private produtoService: ProdutoService,
    private route: Router,
    private messageService: MessageService,
    private clipboard: Clipboard,
    private mensagemService: MensagemService,
    private lojaService: LojaService,
    private categoriaService: CategoriaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.listarCategoria()
    this.listarProdutos();

    this.listarLojas();

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

    if (this.idCategoria !== "") {
      this.produtoService.ProdutoPorCategoria(environment.site, this.idCategoria, this.page, this.size).subscribe(response => {
        this.produtos = response.content;
        this.page++
      });
      return;
    }

    if (this.palavra === "") {
      this.produtoService.listarProduto(this.page, this.size).subscribe((response: any) => {
        this.produtos = response.content
      });
    } else {
      this.pesquisar(this.palavra);
    }
  }

  listarLojas() {
    this.lojaService.listarLojas().subscribe(response => {
      this.lojas = response
    });
  }

  listarCategoria() {
    this.categoriaService.listarCategoria().subscribe(response => {
      this.categorias = response.content;
      // if (this.idCategoria !== "") {
      //   this.totalPage = response.totalPages
      // }
    })
  }

  listarPorCategoria(event: Event) {

    this.produtos = [];

    const id = (event.target as HTMLSelectElement).value;

    this.produtoService.ProdutoPorCategoria(environment.site, id, this.page, this.size).subscribe(response => {
      this.produtos = response.content;
      this.totalPage = response.totalPages;
    });
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

  gerarStory(id: string, preco: string, titulo: string, urlImagem: string, frete: string, cupom: string, link: string) {

    const baseUrl = window.location.href.replace(/painel(\/listar-produtos)?/, '');

    this.copiarParaAreaTransferenciaLink(baseUrl + "oferta/" + id + "?r=1");

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

    let post = this.montarEstruturaCompartilhamento(produtos, valor)

    if (valor === 1) {
      this.clipboard.copy(post);
    } else {
      post = post.replace(/_/g, '__');
      post = post.replace(/\*/g, '**');
      this.clipboard.copy(post);
    }
    this.messageService.add({ severity: 'success', detail: 'POST COPIADO' });
  }

  montarEstruturaCompartilhamento(produto: Produtos, site: number) {
    let estruturaCompartilhamento = "";

    const adicionarTexto = (texto: string) => (estruturaCompartilhamento += texto + "\n");

    const montarTitulo = () => {
      if (produto.copy) {
        adicionarTexto(`*${produto.copy}\n*`);
      } else if (site === 2 || site === 1) {
        adicionarTexto(`\u{1F4CC} ${produto.titulo?.substring(0, 60) ?? ''}...\n`);
      } else {
        adicionarTexto(`\u{1F4CC} ${produto.titulo ?? ''}\n`);
      }
    };

    const montarPreco = () => {
      if (produto.freteVariacoes && produto.freteVariacoes.includes("CUPOM")) {
        adicionarTexto(`*\u{1F525} ${produto.preco} (Frete Grátis)*`);
      } else if (produto.parcelado && produto.parcelado.toLowerCase().includes("sem juros")) {
        adicionarTexto(`*\u{1F525} ${produto.preco} (Parcelado)*`);
      } else {
        adicionarTexto(`*\u{1F449}A Partir de: ${produto.preco}\u{1F525}*`);
      }
    };

    const montarCupom = () => {
      if (produto.cupom) {
        adicionarTexto(
          produto.cupom.length < 20
            ? `\u{1F39F} Use o Cupom: *${produto.cupom}*`
            : `_\u{1F5E3} ${produto.cupom}_`
        );
      }
    };

    const montarLink = () => {
      if (!isPlatformBrowser(this.platformId)) return;

      const loja = produto.loja?.nome_loja?.toLowerCase() || "";
      const baseUrl = window.location.href.replace(/painel(\/listar-produtos)?/, '');
      adicionarTexto(`\n*\u{1F6D2} Confira Aqui:\u{1F447}*\n${baseUrl}oferta/${produto.id}\n`);
      // if ((this.route.url === "/painel" || this.route.url === "/painel/listar-produtos") && (produto.link && produto.descricao?.includes("one"))) {
      //   adicionarTexto(`*\u{1F6D2} Confira no Site Magalu:\u{1F447}*\n${baseUrl}oferta/${produto.id}?r=1`);
      //   adicionarTexto(`*\u{1F6D2} Confira no App Magalu:\u{1F447}*\n${baseUrl}oferta/${produto.id}?r=2`);
      // } else if (["amazon", "mercado livre"].some((nome) => loja.includes(nome))) {
      // } else {
      //   adicionarTexto(`*\u{1F6D2} Confira Aqui:\u{1F447}*\n${baseUrl}oferta/${produto.id}?r=1`);
      // }
    };

    const montarExtras = () => {
      if (produto.freteVariacoes && produto.freteVariacoes.includes("CUPOM")) {
        adicionarTexto(`\u{1F4E6} ${produto.freteVariacoes}\n`);
      }
      if (produto.mensagemAdicional) {
        adicionarTexto(`_${produto.mensagemAdicional}_`);
      }
    };

    montarTitulo();
    montarPreco();
    montarCupom();
    montarLink();
    montarExtras();

    return estruturaCompartilhamento.trim();
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

  showDialog(produto: Produtos) {
    this.produto = produto;
    this.visible = !this.visible;
  }

  enviarTelegram(mensagem: string, url: string) {

    // mensagem = mensagem.replace(/_/g, '__');
    // mensagem = mensagem.replace(/\*/g, '**');

    const mensagemEnviar = {
      mensagem: mensagem,
      url: url
    }

    this.mensagemService.enviarTelegram(mensagemEnviar).subscribe(response => {
      this.messageService.add({ severity: 'success', detail: 'ENVIADO PARA O TELEGRAM' });
      this.visible = !this.visible;
    }, err => {
      this.messageService.add({ severity: 'success', detail: 'ERRO AO ENVIAR' });
      this.visible = !this.visible;
    });
  }
}
