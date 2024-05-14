import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { Produtos } from 'src/app/models/produtos';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-carrossel',
  templateUrl: './carrossel.component.html',
  styleUrls: ['./carrossel.component.css']
})
export class CarrosselComponent {

  @Input() categoriaId: number = 0;

  @ViewChild('caixa') caixaRef!: ElementRef;

  currentIndex = 0;

  page = 0;
  size = 10;

  produtos: Produtos[] = [];

  apiUrl: string = environment.apiUrl;

  constructor(
    private produtoService: ProdutoService,
    private renderer: Renderer2
  ){}

  ngOnInit() {
    this.obeterProdutoPorCategoria()
    this.ngAfterViewInit();
  }

  obeterProdutoPorCategoria(){
    // this.produtoService.obeterProdutoPorCategoria(this.categoriaId).subscribe((response: any) => {
    //   this.produtos = response;
    // })
  }

  ngAfterViewInit() {
    // Verifica se a referência ao elemento foi inicializada corretamente

      const caixa = this.caixaRef.nativeElement as HTMLElement;
      // Agora é seguro acessar o elemento

  }

  scrollLeft() {
    if (this.caixaRef) {
      const caixa = this.caixaRef.nativeElement as HTMLElement;
      caixa.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  }

  scrollRight() {
    if (this.caixaRef) {
      console.log("aqui")
      const caixa = this.caixaRef.nativeElement as HTMLElement;
      caixa.scrollBy({
        left: 200,
        behavior: 'smooth'
      });

    }
  }

}
