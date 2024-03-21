import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Produtos } from 'src/app/models/produtos';
import { ProdutoService } from 'src/app/service/painel/produto.service';

@Component({
  selector: 'app-listar-produtos-cadastrados',
  templateUrl: './listar-produtos-cadastrados.component.html',
  styleUrls: ['./listar-produtos-cadastrados.component.css']
})
export class ListarProdutosCadastradosComponent implements OnInit{

  page = 0;
  size = 10;
  selectedProducts: number[] = [];
  selectAllCheckbox = false;

  totalPage!: number

  number!: number

  produtos: Produtos[] = [];

  constructor(private produtoService: ProdutoService, private route: Router){}

  ngOnInit(): void {
    this.listarProdutos();
  }

  listarProdutos(){
    this.produtoService.listarProduto(this.page, this.size).subscribe( response => {
      this.produtos = this.produtos.concat(response.content)
      this.totalPage = response.totalPages
    });
  }

  changePage(page: any) {
    this.page = page.pageIndex
    this.produtoService.listarProduto(this.page, this.size).subscribe( (response: any) => {
      this.produtos = response.content
    });
  }

  apagarProduto(id: number, urlImagem: string) {
    this.produtoService.apagarProduto(id,urlImagem).subscribe(response => {
      this.route.navigate(["painel"])
    }, err => {
      console.log(err);
    });
  }

  toggleProductSelection(productId: number) {
    if (this.selectedProducts.includes(productId)) {
      // Desmarcar um produto individual
      this.selectedProducts = this.selectedProducts.filter(id => id !== productId);
      // Desmarcar o checkbox "Selecionar Todos"
      this.selectAllCheckbox = false;
    } else {
      // Marcar um produto individual
      this.selectedProducts.push(productId);
    }
  }

  selectAll(event: any) {
    this.selectAllCheckbox = event.target.checked;
    console.log(this.selectAllCheckbox)

    if (this.selectAllCheckbox) {
      // Se o checkbox "Selecionar Todos" estiver marcado, marque todos os outros checkboxes
      this.selectedProducts = this.produtos.map(product => product.id);
    } else {
      // Se o checkbox "Selecionar Todos" estiver desmarcado, desmarque todos os outros checkboxes
      this.selectedProducts = [];
    }
  }

  isAllSelected() {
    // Verifica se todos os produtos estão selecionados
    return this.selectedProducts.length === this.produtos.length;
  }

  isSelected(productId: number): boolean {
    // Verificar se um produto está selecionado
    return this.selectedProducts.includes(productId);
  }

  apagarVariosProdutos(){
    this.produtoService.apagarVariosProdutos(this.selectedProducts).subscribe(response => {
      // alert(`${response}: produtos apagados`);
      this.selectedProducts = [];
      this.produtos = [];
      this.listarProdutos();
    });
  }
}
