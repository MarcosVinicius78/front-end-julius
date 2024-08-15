import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { ReportService } from 'src/app/service/painel/report.service';

// import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { isPlatformBrowser } from '@angular/common';
import * as dateFns from 'date-fns';
import { Message } from 'primeng/api';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { Produtos } from 'src/app/models/produtos';
import { MetaService } from 'src/app/service/meta.service';
import { LinkBannerService } from 'src/app/service/painel/link-banner.service';
import { environment } from 'src/environments/environment';
import { ProdutoLoja } from 'src/app/dto/ProdutoLoja';
import { ProdutoModalDto } from 'src/app/dto/produtoModalDto';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent implements OnInit {

  modal = false;

  page = 0;
  size = 12;

  links = new LinksBanner();

  apiUrl: string = environment.apiUrl;

  id!: string;

  mostrarDialogCompartilhar = false;
  redesSociais = ['Facebook', 'Twitter', 'Instagram', 'WhatsApp'];

  produtos: Produtos[] = [];

  produto = new ProdutoLoja();

  msg!: Message[];

  modalInfo: boolean = false;
  produtoModalDto = new ProdutoModalDto();

  constructor(
    private metaService: MetaService,
    private route: ActivatedRoute,
    private produtoService: ProdutoService,
    private meta: Meta,
    private reportService: ReportService,
    private clipboard: Clipboard,
    private linkBannerService: LinkBannerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id')!;
    this.pegarProduto();

    this.pegarLinks();
  }

  pegarProduto() {

    this.produtoService.pegarProduto(this.id, 0).subscribe(response => {

      this.produto = response;
      this.listarProdutos()
      this.setProductMetaTags(this.produto.titulo, this.produto.descricao, "");
      // if (isPlatformBrowser(this.platformId)) {
      // }

    }, err => {
      this.listarProdutos()
    });
  }

  private setProductMetaTags(productName: string, productDescription: string, productImageUrl: string): void {

    this.meta.addTag({ property: 'og:type', content: "website" });
    this.meta.addTag({ property: 'og:image:width', content: "500" });
    this.meta.addTag({ property: 'og:image:height', content: "500" });
    this.meta.updateTag({ name: 'description', content: "Ofertas" });
    this.meta.updateTag({ property: 'og:title', content: productName });
    this.meta.updateTag({ property: 'og:description', content: productDescription });
    this.meta.updateTag({ property: 'og:image', content: `${this.apiUrl}/produto/download-imagem-real/${this.produto.imagemSocial}` });

  }

  fecharModal() {
    this.modal = false;
    this.modalInfo = false;
  }

  abrirModal() {
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

  montarEstruturaCompartilhamento() {

    let estruturaCompartilhamento = "";

    if (this.produto.titulo.length > 55) {
      estruturaCompartilhamento = `\u{1F4CC} ${this.produto.titulo.substring(0, 60)}...\n\n`;
    } else {
      estruturaCompartilhamento = `\u{1F4CC} ${this.produto.titulo}\n\n`;
    }
    estruturaCompartilhamento += `*\u{1F525} ${this.produto.preco} (À Vista)*\n`;

    if (this.produto.parcelado) {
      estruturaCompartilhamento += `\u{1F4B3} ${this.produto.parcelado}`;
    }

    if (this.produto.cupom) {
      estruturaCompartilhamento += `\n\u{1F39F}Use o Cupom: *${this.produto.cupom}*`;
    }

    if (this.produto.freteVariacoes) {
      estruturaCompartilhamento += `\n\n \u{1F4E6} ${this.produto.freteVariacoes}`;
    }

    if (isPlatformBrowser(this.platformId)) {
      estruturaCompartilhamento += `\n\n *\u{1F6D2} Compre Aqui:\u{1F447}* ${window.location.href}`;
    }

    if (this.produto.mensagemAdicional) {
      estruturaCompartilhamento += `\n\n${this.produto.mensagemAdicional}`;
    }

    return estruturaCompartilhamento;
  }

  compartilhar() {
    this.mostrarDialogCompartilhar = true;
  }

  copiarParaAreaTransferencia() {
    this.clipboard.copy(this.produto.cupom);
    this.msg = [
      { severity: 'success', detail: "CUPOM COPIADO" }
    ]
    setTimeout(() => {
      this.msg = [];
    }, 3000);
  }

  listarProdutos() {
    this.produtoService.listarProduto(this.page, this.size).subscribe(response => {
      this.produtos = response.content
    });
  }

  calculateElapsedTime(createdDate: string): string {
    const currentDate = new Date();
    const differenceInSeconds = dateFns.differenceInSeconds(
      currentDate,
      new Date(createdDate)
    );

    const secondsInMinute = 60;
    const secondsInHour = secondsInMinute * 60;
    const secondsInDay = secondsInHour * 24;
    const secondsInMonth = secondsInDay * 30; // Aproximadamente 30 dias por mês

    if (differenceInSeconds < secondsInMinute) {
      return 'Agora';
    } else if (differenceInSeconds < secondsInHour) {
      const elapsedMinutes = Math.floor(differenceInSeconds / secondsInMinute);
      return `${elapsedMinutes} min atrás`;
    } else if (differenceInSeconds < secondsInDay) {
      const elapsedHours = Math.floor(differenceInSeconds / secondsInHour);
      return `${elapsedHours} horas atrás`;
    } else if (differenceInSeconds < secondsInMonth) {
      const elapsedDays = Math.floor(differenceInSeconds / secondsInDay);
      return `${elapsedDays} dias atrás`;
    } else {
      const elapsedMonths = Math.floor(differenceInSeconds / secondsInMonth);
      return `${elapsedMonths} meses atrás`;
    }
  }

  shares() {

    if (navigator.share) {
      navigator.share({
        title: this.produto.titulo,
        text: this.montarEstruturaCompartilhamento()
      }).then(() => {
        console.log('Conteúdo compartilhado com sucesso.');
      })
        .catch((error) => {
          console.error('Erro ao compartilhar:', error);
        });
    } else {
      console.log('A funcionalidade de compartilhamento não é suportada neste navegador.');
    }
  }

  pegarLinks() {
    this.linkBannerService.listarLinksEBanners().subscribe(response => {
      this.links = response;
    });
  }

  abrirModalInfo(event: Event, cupom: string, img: string, titulo: string, link: string, frete: string, id: number) {
    console.log(frete.length)

    if (cupom && cupom.length > 18 || frete && frete.length > 48) {
      this.produtoModalDto.id = id;
      this.produtoModalDto.titulo = titulo;
      this.produtoModalDto.imagem = img;
      this.produtoModalDto.cupomInformacoes = cupom;
      this.produtoModalDto.link = link;
      this.produtoModalDto.frete = frete
      event.preventDefault();
      this.modalInfo = true;
    }
  }
}
