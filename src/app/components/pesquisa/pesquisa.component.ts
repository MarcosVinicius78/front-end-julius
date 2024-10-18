import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Produtos } from 'src/app/models/produtos';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { environment } from 'src/environments/environment';
import * as dateFns from 'date-fns';
import { Clipboard } from '@angular/cdk/clipboard';
import { ProdutoModalDto } from 'src/app/dto/produtoModalDto';

@Component({
  selector: 'app-pesquisa',
  templateUrl: './pesquisa.component.html',
  styleUrls: ['./pesquisa.component.css']
})
export class PesquisaComponent implements OnInit {

  termoPesquisa: string = "";
  totalItens: number = 0
  isLoadingMore = false;

  page: number = 0
  size: number = 12

  apiUrl: string = environment.apiUrl;

  modal: boolean = false;

  produtos: Produtos[] = [];
  produtoModalDto = new ProdutoModalDto();

  constructor(
    private produtoService: ProdutoService,
    private router: ActivatedRoute,
    private clipboard: Clipboard,
  ) { }

  ngOnInit() {

    this.produtos = []
    this.pesquisar();
  }

  pesquisar() {

    const queryParams = this.router.queryParams.subscribe( params =>{
      this.termoPesquisa = ""
      this.termoPesquisa = params['search'];

      this.isLoadingMore = true;

      this.produtoService.pesquisarProdutos(this.termoPesquisa, this.page, this.size).subscribe(
        data => {
          this.totalItens = data.totalElements
          this.produtos = this.produtos.concat(data.content);
          // this.loading = false;
          this.isLoadingMore = false;
          // this.termoPesquisaAnterior = this.termoPesquisa;
        });


        this.page++
      })
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

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollThreshold = 1;

    if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - scrollThreshold)) {
      // O scroll chegou ao fim da página ou está muito próximo
      if (!this.isLoadingMore) {
        this.pesquisar();
      }
    }
  }

  copiarParaAreaTransferencia(cupom: string) {
    this.clipboard.copy(cupom);
  }

  abrirModal(event: Event, cupom: string, img: string, titulo: string, link: string, frete: string, id: number) {

    if (cupom && cupom.length > 18 || frete && frete.length > 48) {
      this.produtoModalDto.id = id;
      this.produtoModalDto.titulo = titulo;
      this.produtoModalDto.imagem = img;
      this.produtoModalDto.cupomInformacoes = cupom;
      this.produtoModalDto.link = link;
      this.produtoModalDto.frete = frete
      event.preventDefault();
      this.modal = true;
    }
  }

  fecharModal() {
    this.modal = false
  }

}
