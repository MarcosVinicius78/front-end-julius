import { response } from 'express';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ProdutoLoja } from 'src/app/dto/ProdutoLoja';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { environment } from 'src/environments/environment';
import { LinkBannerService } from 'src/app/service/painel/link-banner.service';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { ImagemServiceService } from 'src/app/service/painel/imagem-service.service';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.css']
})
export class BlankComponent implements OnInit {

  produto = new ProdutoLoja();

  links!: LinksBanner

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meta: Meta,
    private produtoService: ProdutoService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private linksService: LinkBannerService,
    public imagemService: ImagemServiceService
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const r = params['r'];
      const rota = params['rota'];

      if (rota !== 'grupos') {
        this.redirecionarProdutos(r, id);
      } else if (rota === 'grupos') {
        this.redirecionarGrupos(r)
      }
    });
  }

  redirecionarGrupos(r: string) {
    this.linksService.listarLinksEBanners().then(response => {
      this.links = response;
      if (r === '1') {
        window.location.href = this.links.links.outros
      }else if(r === '2'){
        window.location.href = this.links.links.whatsapp
      }else if(r === '3'){
        window.location.href = this.links.links.outros
      }
    })
  }

  redirecionarProdutos(r: any, id: string) {
    this.produtoService.pegarProduto(id, r).subscribe(response => {
      // Definir as meta tags aqui
      this.meta.updateTag({ name: 'og:title', content: response.titulo });
      // this.meta.updateTag({ name: 'og:description', content: response.descricao });
      this.meta.updateTag({ name: 'og:image', content: this.imagemService.getImagemUrl(this.produto.imagemSocial, "produtos-real") });


      if (r === '1') {
        window.location.href = response.linkSiteSe!;
      }else if(r === '2'){
        window.location.href = response.linkAppSe!;
      }
    });
  }
}
