import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Produtos } from 'src/app/models/produtos';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import * as dateFns from 'date-fns';

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

    if (Number.isNaN(this.idCategoria)) {
      this.listarProdutos();
      return;
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

}
