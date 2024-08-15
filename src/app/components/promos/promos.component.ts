import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { PrmomsProdutos, ProdutosPromo } from 'src/app/models/promos';
import { LinkBannerService } from 'src/app/service/painel/link-banner.service';
import { PromosService } from 'src/app/service/painel/promos.service';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';

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

  }

  pegarLinks() {
    this.linkBannerService.listarLinksEBanners().subscribe(response => {
      this.links = response;
    });
  }

  copiarParaAreaTransferencia(cupom: string) {
    this.clipboard.copy(cupom);
  }

}
