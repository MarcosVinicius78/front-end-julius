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

  cool = false;

  toggleCool() {
    this.cool = !this.cool;
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
    this.meta.addTag({ property: 'og:image', content: `${this.apiUrl}/loja/mostar-imagem/${this.produto.lojaResponseDto.urlImagem}` });
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
}
