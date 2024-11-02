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
    private linksService: LinkBannerService
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const r = params['r'];

      if (r === '1' && id) {
        this.produtoService.pegarProduto(id, r).subscribe(response => {
          // Definir as meta tags aqui
          this.meta.updateTag({ name: 'og:title', content: response.titulo });
          // this.meta.updateTag({ name: 'og:description', content: response.descricao });
          this.meta.updateTag({ name: 'og:image', content: `${environment.apiUrl}/produto/download-imagem-real/${response.imagemSocial}` });

          this.produto = response;

          window.location.href = response.link_se;
        });
      } else if (r === '2' && id) {
        this.produtoService.pegarProduto(id, r).subscribe(response => {
          // Definir as meta tags aqui
          this.meta.updateTag({ name: 'og:title', content: response.titulo });
          // this.meta.updateTag({ name: 'og:description', content: response.descricao });
          this.meta.updateTag({ name: 'og:image', content: `${environment.apiUrl}/produto/download-imagem-real/${response.imagemSocial}` });

          this.produto = response;

          // Redirecionar para a URL final após definir as meta tags
          if (isPlatformBrowser(this.platformId)) {
            window.location.href = response.descricao;
          }
        });
      } else if(r === '3' && id){

        this.linksService.listarLinksEBanners().then(response => {
          window.location.href = response.links.outros;
        })

      }else{
        // Redirecionar se os parâmetros não forem válidos
        this.router.navigate(['/']);
      }
    });
  }
}
