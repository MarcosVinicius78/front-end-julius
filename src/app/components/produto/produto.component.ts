import { Component, Inject, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ProdutoLoja } from 'src/app/dto/ProdutoLoja';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { ReportService } from 'src/app/service/painel/report.service';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { environment } from 'src/environments/environment';
import { Produtos } from 'src/app/models/produtos';
import * as dateFns from 'date-fns';

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

  like: number = 0;

  convite!: boolean;

  produtos: Produtos[] = [];

  produto = new ProdutoLoja;

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutoService,
    private meta: Meta,
    private reportService: ReportService,
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    if (window.localStorage.getItem("convite") == 'true' || window.localStorage.getItem("convite") == undefined) {
      this.convite = true;
    }

    this.id = this.route.snapshot.paramMap.get('id')!;
    this.pegarProduto();
  }

  redeSocialIcon(rede: string){

    switch (rede) {
      case "Facebook":
        return "../../../assets/facebook.png"
      case "Twitter":
        return "../../../assets/twitter.png"
      case "Instagram":
        return "../../../assets/pngtree-three-dimensional-instagram-icon-png-image_9015419.png"
      case "WhatsApp":
        return "../../../assets/WhatsApp_icon.png.webp"
      default:
        return ""
    }

  }

  likeFuncao() {
    this.like += 1;
  }

  deslikeFuncao(){
    if (this.like <= 0) {
      return
    }
      this.like -= 1;
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
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('property="og:description"');
    // this.meta.removeTag('property="og:image"');

    // Adiciona as novas tags meta
    // this.meta.addTag({ name: 'description', content: productDescription });
    this.meta.addTag({ property: 'og:title', content: productName });
    this.meta.addTag({ property: 'og:description', content: productDescription });
    this.meta.addTag({ property: 'og:image', content: `${this.apiUrl}/produto/download/${this.produto.imagem}` });
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
    let estruturaCompartilhamento = `${this.produto.titulo}\n\n`;
    estruturaCompartilhamento += `*Por: ${this.produto.preco} (À Vista)*\n`;

    if (this.produto.parcelado) {
      estruturaCompartilhamento += `Ou: ${this.produto.parcelado} (Parcelado)\n\n`;
    }

    if (this.produto.cupom) {
      estruturaCompartilhamento += `Use o Cupom: *${this.produto.cupom}*\n\n`;
    }

    if (this.produto.freteVariacoes) {
      estruturaCompartilhamento += `${this.produto.freteVariacoes}\n\n`;
    }

    estruturaCompartilhamento += `Confira aqui: ${window.location.href}`;

    if (this.produto.mensagemAdicional) {
      estruturaCompartilhamento += `\n\n${this.produto.mensagemAdicional}`;
    }

    return estruturaCompartilhamento;
  }

  compartilhar() {
    this.mostrarDialogCompartilhar = true;
  }

  fecharDialogCompartilhar() {
    this.mostrarDialogCompartilhar = false;
  }

  abrirConviteMobile(){

  }

  fecharConviteMobile(){
    console.log("Teste")
    window.localStorage.getItem('convite');
    if (window.localStorage.getItem('convite') == 'true') {
      window.localStorage.setItem('convite', 'false');
      this.convite = false;
    }else{
      window.localStorage.setItem("convite", "true");
    }
  }

  compartilharRedeSocial(redeSocial: string) {
    this.fecharDialogCompartilhar();
    // Lógica para compartilhar na rede social escolhida
    console.log(`Compartilhando no ${redeSocial}`);
  }

  copiarParaAreaTransferencia() {
    this.fecharDialogCompartilhar();
    const textoParaCopiar = this.montarEstruturaCompartilhamento();
    this.clipboard.copy(textoParaCopiar);
    this.snackBar.open('Texto copiado para a Área de Transferência', 'Fechar', {
      duration: 2000,
    });
  }

  produtosPorCategoria(){
    this.produtoService.obeterProdutoPorCategoria(this.produto.categoriaDto.categoria_id).subscribe(response => {
      this.produtos = response
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
}
