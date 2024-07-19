import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { Produtos } from 'src/app/models/produtos';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { isPlatformBrowser } from '@angular/common';

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
  }

  listarProdutos() {
    this.produtoService.listarProduto(this.page, this.size).subscribe(response => {
      this.produtos = this.produtos.concat(response.content)
      this.totalPage = response.totalPages
    });
  }

  changePage(page: any) {
    this.page = page.page
    this.produtoService.listarProduto(this.page, this.size).subscribe((response: any) => {
      this.produtos = response.content
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

    console.log(this.selectedProducts)

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

      // const contentDisposition = response.headers.get('content-disposition');
      // const fileName = contentDisposition!.split(';')[1].split('=')[1].trim();

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

  copiarParaAreaTransferencia(produtos: Produtos) {
    this.clipboard.copy(this.montarEstruturaCompartilhamento(produtos));
    this.messageService.add({ severity: 'success', detail: 'POST COPIADO' });
  }

  montarEstruturaCompartilhamento(produto: Produtos) {


    let estruturaCompartilhamento = "";

    if (produto.copy) {
      estruturaCompartilhamento += `*${produto.copy}*\n\n`
    }

    if (produto.titulo.length > 55) {
      estruturaCompartilhamento += `\u{1F4CC} ${produto.titulo.substring(0, 60)}...\n\n`;
    } else {
      estruturaCompartilhamento += `\u{1F4CC} ${produto.titulo}\n\n`;
    }
    estruturaCompartilhamento += `*\u{1F525} ${produto.preco} (À Vista)*\n`;

    if (produto.parcelado) {
      estruturaCompartilhamento += `* ${produto.parcelado}\n`;
    }
    // \u{1F4B3}
    if (produto.cupom) {
      estruturaCompartilhamento += `\n\u{1F39F} Use o Cupom: *${produto.cupom}*`;
    }

    if (produto.freteVariacoes) {
      if (produto.cupom) {
        estruturaCompartilhamento += `\n\u{1F4E6} ${produto.freteVariacoes}\n`;
      } else {
        estruturaCompartilhamento += `\n\u{1F4E6} ${produto.freteVariacoes}\n`;
      }
    }

    if (isPlatformBrowser(this.platformId)) {

      if (produto.loja.nome_loja.toLocaleLowerCase().includes("amazon") || produto.loja.nome_loja.toLocaleLowerCase().includes("mercado")) {
        if (this.route.url === "/painel") {
          estruturaCompartilhamento += `\n *\u{1F6D2} Compre Aqui:\u{1F447}* ${window.location.href.replace("painel", '')}oferta/${produto.id}`;
        } else {
          estruturaCompartilhamento += `\n *\u{1F6D2} Compre Aqui:\u{1F447}* ${window.location.href.replace("painel/listar-produtos", '')}oferta/${produto.id}`;
        }
      } else {
        if (this.route.url === "/painel") {
          estruturaCompartilhamento += `\n *\u{1F6D2} Compre Aqui:\u{1F447}* ${window.location.href.replace("painel", '')}oferta/${produto.id}?r=1`;
        } else {
          estruturaCompartilhamento += `\n *\u{1F6D2} Compre Aqui:\u{1F447}* ${window.location.href.replace("painel/listar-produtos", '')}oferta/${produto.id}?r=1`;
        }
      }
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
}
