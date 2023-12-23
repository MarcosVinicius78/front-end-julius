import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Produtos } from 'src/app/models/produtos';
import { ProdutoService } from 'src/app/service/painel/produto.service';

@Component({
  selector: 'app-listar-produtos',
  templateUrl: './listar-produtos.component.html',
  styleUrls: ['./listar-produtos.component.css']
})
export class ListarProdutosComponent implements OnInit {

  produtos: Produtos[] = [];

  idCategoria: number | undefined;

  page = 0;
  size = 10;

  constructor(private produtoService: ProdutoService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.idCategoria = Number.parseInt(this.route.snapshot.paramMap.get('id')!);

    console.log(this.idCategoria)

    if (!this.idCategoria) {
      this.listarProdutos();
    }

    this.listarPorCategoria();
  }

  listarPorCategoria(){
    this.produtoService.ProdutoPorCategoria(this.idCategoria, this.page, this.size).subscribe(response => {
      this.produtos = this.produtos.concat(response);
    });
  }

  listarProdutos() {
    this.produtoService.listarProduto(this.page, this.size).subscribe((response: any) => {
      this.produtos = this.produtos.concat(response.content)
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.offsetHeight;

    if (scrollPosition >= documentHeight) {

      // Lógica de paginação
      this.page++;
      if (!this.idCategoria) {
        this.listarProdutos()
        return;
      }

      this.listarPorCategoria()

      return;
    }
  }

  calcularTempoDecorrido(dataCriacao: string): string {
    const dataCriacaoDate = new Date(dataCriacao);
    const agora = new Date();

    dataCriacaoDate.setTime(parseInt(dataCriacao[6]))

    const diferencaEmMilliseconds = agora.getTime() - dataCriacaoDate.getTime();
    const segundos = Math.floor(diferencaEmMilliseconds / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);

    if (horas > 0) {
      return `Postado há ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    } else if (minutos > 0) {
      return `Postado há ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    } else {
      return 'Postado agora mesmo';
    }
  }

}
