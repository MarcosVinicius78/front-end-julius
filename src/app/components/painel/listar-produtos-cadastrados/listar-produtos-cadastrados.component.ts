import { ImagemServiceService } from './../../../service/painel/imagem-service.service';
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
import { ScraperService } from 'src/app/service/painel/scraper.service';


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
  idLoja: string = ""

  categorias!: Categoria[];
  lojas!: Loja[];

  // produto!: Produtos;
  selectedProducts!: Produtos;

  openMenuId: number | null = null;

  visible: boolean = false;
  linkCurto!: boolean

  visualiarDropdowncategoria: boolean = false
  visualiarDropdownLoja: boolean = false
  visualiarCampoPesquisa: boolean = true

  isFiltroVisible: boolean = false;
  filtroSelecionado: string | null = null;

  filtros = [
    { label: 'Categoria', value: 'CATEGORIA' },
    { label: 'Loja', value: 'LOJA' },
    { label: 'Pesquisar', value: 'PESQUISA' },
  ];

  constructor(
    private produtoService: ProdutoService,
    private route: Router,
    private messageService: MessageService,
    private clipboard: Clipboard,
    private mensagemService: MensagemService,
    private lojaService: LojaService,
    private categoriaService: CategoriaService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private scravperService: ScraperService,
    public imagemServiceService: ImagemServiceService
  ) { }

  ngOnInit(): void {
    this.listarCategoria()
    this.listarProdutos();

    this.statusLinkCurto()

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

  statusLinkCurto() {
    this.scravperService.statusLinkCurto().subscribe(res => {
      this.linkCurto = res;
    })
  }

  listarProdutos() {
    this.produtoService.listarProduto(this.page, this.size).subscribe({ 
      next: (res) => {
        this.produtos = this.produtos.concat(res.content)
        this.totalPage = res.totalPages
        console.log(res)
      }
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

    if (this.idLoja !== "") {
      this.produtoService.buscarProdutoPorLoja(environment.site, this.idLoja, this.page, this.size).subscribe(response => {
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

    this.idCategoria = (event.target as HTMLSelectElement).value;

    this.produtoService.ProdutoPorCategoria(environment.site, this.idCategoria, this.page, this.size).subscribe(response => {
      this.produtos = response.content;
      this.totalPage = response.totalPages;
    });
  }

  listarPorLoja(event: Event) {

    this.produtos = [];

    this.idLoja = (event.target as HTMLSelectElement).value;

    this.produtoService.buscarProdutoPorLoja(environment.site, this.idLoja, this.page, this.size).subscribe(response => {
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

  toggleFiltro() {
    this.isFiltroVisible = !this.isFiltroVisible;
  }

  filtrar(filtro: string) {
    this.toggleFiltro();

    this.visualiarDropdowncategoria = false;
    this.visualiarCampoPesquisa = false;
    this.visualiarDropdownLoja = false;

    if (filtro.match("CATEGORIA")) {
      this.visualiarDropdowncategoria = true;
      this.visualiarCampoPesquisa = false;
    } else if (filtro.match("LOJA")) {
      this.visualiarDropdownLoja = true;
      this.visualiarCampoPesquisa = false;
    } else {
      this.visualiarCampoPesquisa = true;
    }
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
        adicionarTexto(`*${produto.copy}*\n`);
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
        adicionarTexto(`*\u{1F449}A Partir de ${produto.preco}\u{1F525}*`);
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

      if (this.linkCurto) {
        const baseUrl = window.location.href.replace(/painel(\/listar-produtos)?/, '');
        adicionarTexto(`\n*\u{1F6D2} Confira Aqui:\u{1F447}*\n${baseUrl}oferta/${produto.id}?r=1\n`);
      }else{
        const baseUrl = window.location.href.replace(/painel(\/listar-produtos)?/, '');
        adicionarTexto(`\n*\u{1F6D2} Confira Aqui:\u{1F447}*\n${baseUrl}oferta/${produto.id}\n`);
      }
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
      this.messageService.add({ severity: 'error', detail: 'ERRO AO ENVIAR' });
      this.visible = !this.visible;
    });
  }
}
