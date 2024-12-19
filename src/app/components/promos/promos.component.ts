import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { PrmomsProdutos, ProdutosPromo } from 'src/app/models/promos';
import { LinkBannerService } from 'src/app/service/painel/link-banner.service';
import { PromosService } from 'src/app/service/painel/promos.service';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { AnaliseService } from 'src/app/service/painel/analise.service';

@Component({
  selector: 'app-promos',
  templateUrl: './promos.component.html',
  styleUrls: ['./promos.component.scss']
})
export class PromosComponent implements OnInit {

  apiUrl = environment.apiUrl

  links = new LinksBanner();

  id!: string;

  produtos!: ProdutosPromo[];

  analiseService = inject(AnaliseService)

  constructor(
    private promosService: PromosService,
    private route: ActivatedRoute,
    private meta: Meta,
    private linkBannerService: LinkBannerService,
    private clipboard: Clipboard
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.listarProdutos()
    this.pegarLinks()
  }

  listarProdutos(){
    this.promosService.pegarPromo(this.id).subscribe(response => {
      this.produtos = response.produtoResponseDto
      this.setProductMetaTags(response.copyPromo, "Ofertas", response.urlImagem)
      this.registrarAcessoSistema()
    })
  }

  private setProductMetaTags(productName: string, productDescription: string, productImageUrl: string): void {

    this.meta.addTag({ property: 'og:type', content: "website" });
    this.meta.addTag({ property: 'og:image:width', content: "500" });
    this.meta.addTag({ property: 'og:image:height', content: "500" });
    this.meta.updateTag({ name: 'description', content: "Ofertas" });
    this.meta.updateTag({ property: 'og:title', content: productName });
    this.meta.updateTag({ property: 'og:description', content: productDescription });
    this.meta.updateTag({ property: 'og:image', content: `${this.apiUrl}/promos/download-imagem-promo/${productImageUrl}` });

    this.addPreloadLink(`${this.apiUrl}/promos/download-imagem-promo/${productImageUrl}`)

  }

  registrarAcessoSistema() {
    if (!sessionStorage.getItem('acessoRegistradoHome')) {
      this.analiseService.registrarEvento('ACESSO_SISTEMA').subscribe(() => {
        sessionStorage.setItem('acessoRegistradoHome', 'true');
      });
    }
  }

  addPreloadLink(href: string): void {
    const link: HTMLLinkElement = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = href;
    link.type = 'image/jpeg';
    document.head.appendChild(link);
  }

  pegarLinks() {
    this.linkBannerService.listarLinksEBanners().then(response => {
      this.links = response;
    });
  }

  copiarParaAreaTransferencia(cupom: string) {
    this.clipboard.copy(cupom);
  }

}
