import { AfterViewInit, Component, HostListener, Inject, OnDestroy, OnInit, ViewChild, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Produtos } from 'src/app/models/produtos';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import * as dateFns from 'date-fns';
import { LinkBannerService } from 'src/app/service/painel/link-banner.service';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-listar-produtos',
  templateUrl: './listar-produtos.component.html',
  styleUrls: ['./listar-produtos.component.css']
})
export class ListarProdutosComponent implements OnInit {
  @ViewChild('swiper', { static: false }) swiper: any;

  apiUrl: string = environment.apiUrl

  produtos: Produtos[] = [];

  text: string = 'tesrte'

  idCategoria: number | undefined;

  links = new LinksBanner();


  termoPesquisaAnterior: string = '';
  termoPesquisa: string = '';

  page = 0;
  pagePesquisa = 0;
  size = 12;
  slideIndex = 1;

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  loading = false;


  constructor(
    private produtoService: ProdutoService,
    private linkBannerService: LinkBannerService,
    private route: ActivatedRoute,
    private clipboard: Clipboard
  ) { }

  ngOnInit() {

    if (this.links.banners.length != 0) {
      this.startSlideShow();
      this.showSlides(this.slideIndex)
    }

    this.pegarLinks()

    this.idCategoria = Number.parseInt(this.route.snapshot.paramMap.get('id')!);

    if (Number.isNaN(this.idCategoria)) {
      this.listarProdutos();
      return;
    }

    this.listarPorCategoria();
  }

  listarPorCategoria() {
    this.produtoService.ProdutoPorCategoria(environment.site,this.idCategoria, this.page, this.size).subscribe(response => {
      this.produtos = this.produtos.concat(response);
      this.page++
      this.loading = false
    });
  }

  listarProdutos() {
    this.loading = true;
    this.produtoService.listarProduto(this.page, this.size).subscribe((response: any) => {
      this.produtos = this.produtos.concat(response.content)
      this.page++;
      this.loading = false;
    });
  }

  private isAtBottom(): boolean {
    const threshold = 100; // Buffer de 100 pixels antes de considerar que o scroll chegou ao final
    const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    const isBottom = scrollTop + clientHeight >= scrollHeight - threshold;
    return isBottom;
  }

  @HostListener('window:scroll', [])
  onScroll(event: Event): void {
    // const scrollPosition = window.scrollY + window.innerHeight;
    // const documentHeight = document.documentElement.offsetHeight;

    if (this.isAtBottom() && !this.loading && this.termoPesquisa === '' && Number.isNaN(this.idCategoria)) {
      this.listarProdutos()
    }

    if (this.termoPesquisa != '') {
      this.pesquisar()
    }

    if (this.isAtBottom() && !this.loading && !Number.isNaN(this.idCategoria)) {
      this.listarPorCategoria();
    }

  }

  pesquisar(): void {
    this.idCategoria = NaN;

    if (this.termoPesquisa != this.termoPesquisaAnterior) {
      this.pagePesquisa = 0;
    }
    if (this.pagePesquisa == 0) {
      this.produtos = [];
    }


    this.produtoService.pesquisarProdutos(this.termoPesquisa,this.pagePesquisa, this.size).subscribe(
      data => {
        this.produtos = this.produtos.concat(data.content);
        this.pagePesquisa++
        this.loading = false;
        this.termoPesquisaAnterior = this.termoPesquisa;
      },
      error => {
        console.error('Erro ao pesquisar produtos:', error);
      }
    );
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

  pegarLinks() {
    this.linkBannerService.listarLinksEBanners().subscribe(response => {
      this.links = response;
    });
  }

  plusSlides(n: number) {
    this.showSlides(this.slideIndex += n);
  }

  showSlides(n: number) {
    let i;
    const slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;

    if (n > slides.length) { this.slideIndex = 1 }
    if (n < 1) { this.slideIndex = slides.length }

    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    slides[this.slideIndex - 1].style.display = "block";

  }
  intervalId: any;

  startSlideShow() {
    this.intervalId = setInterval(() => {
      this.plusSlides(1);
    }, 5000); // Altere o intervalo de acordo com sua preferência (5 segundos = 5000 milissegundos)
  }

  stopSlideShow() {
    clearInterval(this.intervalId);
  }

  copiarParaAreaTransferencia(cupom: string) {
    this.clipboard.copy(cupom);
  }
}
