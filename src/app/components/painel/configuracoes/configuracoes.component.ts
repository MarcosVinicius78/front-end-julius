import { ScraperService } from './../../../service/painel/scraper.service';
import { FormBuilder } from '@angular/forms';
import { ProdutoService } from './../../../service/painel/produto.service';
import { Component, OnInit } from '@angular/core';
import { ScraperProduto } from 'src/app/dto/ScraperProduto';
import { environment } from 'src/environments/environment';
import { ImagemServiceService } from 'src/app/service/painel/imagem-service.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss'],
  providers: [MessageService]
})
export class ConfiguracoesComponent implements OnInit{

  imagemFile!: File;
  imagemView!: string;

  api = environment.apiUrl;

  check!: boolean
  linkAtivado!: boolean
  linkSemDominioAtivado!: boolean
  tempoDoRobo!: number

  constructor(
    private scraperService: ScraperService,
    public imagemService: ImagemServiceService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.statusBot();
    this.buscarTempoRobo()
    this.statusLinkCurto()
    this.statusLinkSemDominio()
  }

  ativarLinkCurto(){
    this.scraperService.ativarLinkCurto(this.linkAtivado).subscribe();
  }

  statusLinkCurto(){
    this.scraperService.statusLinkCurto().subscribe(res => {
      this.linkAtivado = res;
    });
  }

  ativarLinkSemDominio(){
    this.scraperService.ativarLinkSemDominio(this.linkSemDominioAtivado).subscribe();
  }

  statusLinkSemDominio(){
    this.scraperService.statusLinkSemDominio().subscribe(res => {
      this.linkSemDominioAtivado = res;
    });
  }

  onFileChange(event: any) {
    console.log(event.currentFiles)

    this.imagemFile = event.currentFiles[0]
    const reader = new FileReader();

    reader.readAsDataURL(this.imagemFile);
  }

  salvarStory() {

    const formData = new FormData();
    formData.append('urlImagem', this.imagemFile);
    formData.append('caminho', "produtos");

    this.imagemService.salvarImagemSemProduto(formData).subscribe(response => {
      this.messageService.add({ severity: 'success', detail: 'Imagem salva' });
    }, () => {
      this.messageService.add({ severity: 'error', detail: 'Erro ao salvar imagem' });
    })
  }

  mudarTempoDoRobo(){
    this.scraperService.mudarTempoDoRobo(this.tempoDoRobo).subscribe(response => {

    })
  }

  buscarTempoRobo(){
    this.scraperService.buscarTempoDoRobo().subscribe(response => {
      this.tempoDoRobo = response;
    })
  }

  ativarBot(){
    this.scraperService.ativarBot(this.check).subscribe(response => {

    })
  }

  statusBot(){

    this.scraperService.statusBot().subscribe(response => {
      this.check = response
    })
  }
}
