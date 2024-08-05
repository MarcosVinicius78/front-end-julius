import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ProdutoLoja } from 'src/app/dto/ProdutoLoja';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.css']
})
export class BlankComponent implements OnInit {

  produto = new ProdutoLoja();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meta: Meta,
    private produtoService: ProdutoService
  ) { }

  ngOnInit(): void {
    // const id = this.route.queryParams['id']
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const r = params['r'];

      if (r === '1' && id) {
        this.produtoService.pegarProduto(id,r).subscribe(response => {
          // Definir as meta tags aqui
          this.meta.updateTag({ name: 'og:title', content: response.titulo });
          this.meta.updateTag({ name: 'og:description', content: response.descricao });
          this.meta.updateTag({ name: 'og:image', content: `${environment.apiUrl}/produto/download-imagem-real/${response.imagemSocial}` });

          // Redirecionar para a URL final após definir as meta tags
          window.location.href = response.link_se;
        });
      } else {
        // Redirecionar se os parâmetros não forem válidos
        this.router.navigate(['/']);
      }
    });
  }
}
