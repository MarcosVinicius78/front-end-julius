import { AnaliseService } from './../../service/painel/analise.service';
import { LinksBanner } from './../../dto/LinksBanner';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as dateFns from 'date-fns';
import { Banner } from 'src/app/models/banner';
import { AtivarRodapéService } from 'src/app/service/ativarRodapé.service';
import { LinkBannerService } from 'src/app/service/painel/link-banner.service';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { environment } from 'src/environments/environment';
import { ImagemServiceService } from 'src/app/service/painel/imagem-service.service';
import { IProdutoResponseDto } from 'src/app/dto/IProdutoResponseDto';
import { TotalDeAcessosPorCategoria } from 'src/app/dto/evento/TotalDeAcessosPorCategoria';

@Component({
  selector: 'app-listar-produtos',
  templateUrl: './listar-produtos.component.html',
  styleUrls: ['./listar-produtos.component.scss']
})
export class ListarProdutosComponent implements OnInit {
  @ViewChild('swiper', { static: false }) swiper: any;

  apiUrl: string = environment.apiUrl

  produtos: IProdutoResponseDto[] = [];

  text: string = 'tesrte'

  idCategoria: number | undefined;

  links: LinksBanner = new LinksBanner;
  banners: Banner[] = []

  convite: number = 4

  termoPesquisaAnterior: string = '';
  termoPesquisa: string = '';

  page = 0;
  pagePesquisa = 0;
  size = 12;
  slideIndex = 1;

  dataHoje: string = "";

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  isLoading: boolean = true;

  acessosPorCategoria: TotalDeAcessosPorCategoria[] = [];

  loading = false;

  path!: string;

  constructor(
    private produtoService: ProdutoService,
    private linkBannerService: LinkBannerService,
    private route: ActivatedRoute,
    private clipboard: Clipboard,
    private ativarRodape: AtivarRodapéService,
    private sanitizer: DomSanitizer,
    private analiseService: AnaliseService,
    public imagemService: ImagemServiceService
  ) { }

  ngOnInit() {

    this.buscarDataAtual();

    this.route.url.subscribe(params => {
      this.path = params.map(segment => segment.path).join(("/"));
    });

    this.registrarAcessoSistema()

    this.totalDeAcessosPorCategoria();

    this.pegarLinks()

    this.idCategoria = Number.parseInt(this.route.snapshot.paramMap.get('id')!);

    if (this.path !== "destaque") {
      if (Number.isNaN(this.idCategoria)) {
        this.listarProdutos();
        return;
      }

      this.listarPorCategoria();
      return
    }

    this.produtos = []
    this.produtosEmDestaque();
  }

  registrarAcessoSistema() {
    if (!sessionStorage.getItem('acessoRegistradoHome')) {
      this.analiseService.registrarEvento('ACESSO_SISTEMA').subscribe(() => {
        sessionStorage.setItem('acessoRegistradoHome', 'true');
      });
    }
  }

  getSafeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  totalDeAcessosPorCategoria() {
    this.analiseService.totalDeAcessosPorCategoria(this.dataHoje).subscribe({
      next: (res) => this.acessosPorCategoria = res,
      error: (error) => console.log(error)
    })
  }

  buscarDataAtual() {
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const dia = String(dataAtual.getDate()).padStart(2, '0');

    const dataFormatada = `${ano}-${mes}-${dia}`;

    this.dataHoje = dataFormatada;
  }

  listarPorCategoria() {
    // this.loading = true;
    this.produtoService.ProdutoPorCategoria(environment.site, this.idCategoria, this.page, this.size).subscribe(response => {
      this.produtos = this.produtos.concat(response.content);
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

    const scrollThreshold = 1;

    if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - scrollThreshold)) {
      // O scroll chegou ao fim da página ou está muito próximo
      if (!this.loading) {
        if (this.termoPesquisa === '' && Number.isNaN(this.idCategoria) && this.path !== "destaque") {
          this.listarProdutos()
        }

        if (this.termoPesquisa != '' && Number.isNaN(this.idCategoria) && this.pagePesquisa < this.page) {
          this.pesquisar();
        }

        if (!Number.isNaN(this.idCategoria)) {
          this.listarPorCategoria();
        }

        if (this.path === "destaque" && Number.isNaN(this.idCategoria) && this.pagePesquisa < this.page) {
          this.produtosEmDestaque();
        }
      }
    }

    // if (this.isAtBottom() && !this.loading && this.termoPesquisa === '' && Number.isNaN(this.idCategoria) && this.path !== "destaque") {
    //   this.listarProdutos()
    //   return
    // }

    // if (this.isAtBottom() && this.termoPesquisa != '' && !this.loading && Number.isNaN(this.idCategoria) && this.pagePesquisa < this.page) {
    //   this.pesquisar()
    //   return
    // }

    // if (this.isAtBottom() && !this.loading && !Number.isNaN(this.idCategoria)) {
    //   this.listarPorCategoria();
    //   return
    // }

    // if (this.isAtBottom() && !this.loading && this.path === "destaque" && Number.isNaN(this.idCategoria) && this.pagePesquisa < this.page) {
    //   this.produtosEmDestaque();
    //   return
    // }

  }

  pesquisar(): void {
    this.idCategoria = NaN;

    if (this.termoPesquisa != this.termoPesquisaAnterior) {
      this.pagePesquisa = 0;
    }
    if (this.pagePesquisa == 0) {
      this.produtos = [];
    }


    this.produtoService.pesquisarProdutos(this.termoPesquisa, this.pagePesquisa, this.size).subscribe(
      data => {
        this.page = data.pageable.pageSize
        this.produtos = this.produtos.concat(data.content);
        this.loading = false;
        this.termoPesquisaAnterior = this.termoPesquisa;
        console.log(data)
      });
    this.pagePesquisa++
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
    this.linkBannerService.listarLinksEBanners()
      .then(response => {
        this.links = response; // Atribua a resposta
      })
      .catch(error => {
        console.error('Erro ao obter links e banners:', error);
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

  produtosEmDestaque() {
    this.produtoService.listarDestaques(this.pagePesquisa, this.size).subscribe(response => {
      this.produtos = this.produtos.concat(response.content);
      this.page = response.totalPages
    });
    this.loading = false;
    this.pagePesquisa++

  }

  abrirFooter() {
    this.ativarRodape.ativarRodape(true);
  }
}
