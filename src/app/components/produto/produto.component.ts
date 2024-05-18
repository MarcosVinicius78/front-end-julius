import { Component, Inject, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ProdutoLoja } from 'src/app/dto/ProdutoLoja';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { ReportService } from 'src/app/service/painel/report.service';

// import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { environment } from 'src/environments/environment';
import { Produtos } from 'src/app/models/produtos';
import * as dateFns from 'date-fns';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit {

  modal = false;

  apiUrl: string = environment.apiUrl;

  id!: string;

  mostrarDialogCompartilhar = false;
  redesSociais = ['Facebook', 'Twitter', 'Instagram', 'WhatsApp'];

  convite!: boolean;

  produtos: Produtos[] = [];

  produto = new ProdutoLoja;

  msg!: Message[];

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutoService,
    private meta: Meta,
    private reportService: ReportService,
    // private dialog: MatDialog,
    private clipboard: Clipboard,
    // private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    if (window.localStorage.getItem("convite") == 'true' || window.localStorage.getItem("convite") == undefined) {
      this.convite = true;
    }

    this.id = this.route.snapshot.paramMap.get('id')!;
    this.pegarProduto();
  }

  pegarProduto() {

    this.produtoService.pegarProduto(this.id).subscribe(response => {

      this.produto = response;
      this.produtosPorCategoria()
      this.setProductMetaTags(this.produto.titulo, this.produto.descricao, window.location.href);

    });
  }

  private setProductMetaTags(productName: string, productDescription: string, productImageUrl: string): void {
    // Limpa todas as tags meta existentes
    // this.meta.removeTag('name="description"');
    // this.meta.removeTag('property="og:title"');
    // this.meta.removeTag('property="og:description"');
    // this.meta.removeTag('property="og:image"');

    // Adiciona as novas tags meta
    // this.meta.addTag({ property: 'og:image:height', content: "300" });
    // this.meta.addTag({ property: 'og:image:width', content: "300" });
    // this.meta.addTag({ property: 'og:site_name', content: "Sergipe Ofertas" });
    // this.meta.addTag({ property: 'og:locale', content: "pt_BR" });
    // this.meta.addTag({ property: 'og:url', content: window.location.href });
    // this.meta.addTag({ property: 'og:type', content: "website" });
    // this.meta.addTag({ property: 'og:image:type', content: "image/jpeg" });


    // this.meta.addTag({ name: 'description', content: "as melhores promoções" });
    // this.meta.addTag({ property: 'og:title', content: productName });
    // this.meta.addTag({ property: 'og:description', content: productDescription });
    // this.meta.addTag({ property: 'og:image', content: `${this.apiUrl}/produto/download/${this.produto.imagem}` });
  }

  fecharModal() {
    this.modal = false;
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
      estruturaCompartilhamento += `\n \u{1F39F}Use o Cupom: *${this.produto.cupom}*`;
    }

    if (this.produto.freteVariacoes) {
      estruturaCompartilhamento += `\n\n \u{1F4E6} ${this.produto.freteVariacoes}`;
    }

    estruturaCompartilhamento += `\n\n *\u{1F6D2} Compre Aqui:\u{1F447}* ${window.location.href}`;

    if (this.produto.mensagemAdicional) {
      estruturaCompartilhamento += `\n\n${this.produto.mensagemAdicional}`;
    }

    console.log(estruturaCompartilhamento)

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

  produtosPorCategoria() {
    this.produtoService.obeterProdutoPorCategoria().subscribe(response => {
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
}
