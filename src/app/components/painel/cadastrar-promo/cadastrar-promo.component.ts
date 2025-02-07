import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Produtos } from 'src/app/models/produtos';
import { PrmomsProdutos, ProdutosPromo, PromoSalvar } from 'src/app/models/promos';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { PromosService } from 'src/app/service/painel/promos.service';
import { response } from 'express';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cadastrar-promo',
  templateUrl: './cadastrar-promo.component.html',
  styleUrls: ['./cadastrar-promo.component.scss'],
  providers: [MessageService]
})
export class CadastrarPromoComponent implements OnInit {

  apiUrl = environment.apiUrl

  modal: boolean = false;

  produtosSelecionadoGroup!: FormGroup;

  page = 0
  size = 12
  idEditar!: number
  totalPageProdutos!: number;

  totalPagepromo!: number;
  pagePromo = 0;
  sizePromo = 12;

  imagemFile!: File;
  imagemView!: string;

  sourceProducts!: Produtos[];
  targetProducts!: Produtos[];

  promoSalvar!: PromoSalvar
  promosProdutos!: PrmomsProdutos[];

  constructor(
    private promoService: PromosService,
    private produtosService: ProdutoService,
    private formBuilder: FormBuilder,
    private clipboard: Clipboard,
    private messageService: MessageService
  ) { }

  ngOnInit() {

    this.produtosSelecionadoGroup = this.formBuilder.group({
      copyPromo: ['', [Validators.required]]
    });

    this.listarPromo()
  }

  onPageChange(event: any) {
    this.page = event.first;
    // this.size = event.rows;
    this.listarProdutosModal()
  }

  onFileChange(event: any) {

    this.imagemFile = event.currentFiles[0]
    const reader = new FileReader();

    reader.readAsDataURL(this.imagemFile);
  }

  listarPromo() {
    this.promoService.listarPromos(this.pagePromo, this.sizePromo).subscribe(response => {
      this.promosProdutos = response.content
      this.totalPagepromo = response.totalPages
    });
  }

  abrirModal() {
    this.modal = true;
    this.sourceProducts = []
    this.listarProdutosModal()
    this.targetProducts = []
  }

  listarProdutosModal() {
    this.produtosService.listarProduto(this.page, this.size).subscribe(response => {
      this.sourceProducts = response.content
      this.totalPageProdutos = response.totalPages
    });
  }

  salvarPromo() {

    if (this.targetProducts.length !== 0 && !this.produtosSelecionadoGroup.invalid) {

      this.promoSalvar = {
        id: 0,
        copyPromo: '',
        idProdutos: []
      }

      this.promoSalvar.copyPromo = this.produtosSelecionadoGroup.get('copyPromo')?.value

      if (this.idEditar === undefined || this.idEditar === 0) {

        this.targetProducts.forEach(item => {
          this.promoSalvar.idProdutos.push(item.id)
        })

        this.promoService.salvarPromo(this.promoSalvar).subscribe(response => {

          this.modal = false
          this.salvarImagem(response.idPromo)
          this.idEditar = 0
          this.produtosSelecionadoGroup.reset()
          this.messageService.add({ severity: 'success', summary: 'success', detail: 'Promocoes Salvas' });
          this.listarPromo()
          return
        })
      }
      this.atualizarPromo()
    }
    this.messageService.add({ severity: 'warn', summary: 'warn', detail: 'Informe os Campos' });
  }

  salvarImagem(id: any) {

    const formData = new FormData();
    formData.append('file', this.imagemFile);
    formData.append('id', id);

    this.promoService.salvarImagem(formData).subscribe(response => {

    }, err => {

    })
  }

  atualizarPromo() {

    this.targetProducts.forEach(response => {
      this.promoSalvar.idProdutos.push(response.id)
    })

    this.promoSalvar.id = this.idEditar
    this.promoService.atualizarPromo(this.promoSalvar).subscribe(response => {
      this.modal = false
      this.listarPromo()
      this.idEditar = 0
      this.produtosSelecionadoGroup.reset()
      return
    });
  }

  apagarPromo(id: number, urlImagem: string) {
    this.promoService.apagarPromo(id, urlImagem).subscribe(response => {
      this.listarPromo()
    }, err => {

    });
  }

  editarPromo(copy: string, idEditar: number, produtosEditar: ProdutosPromo[]) {

    this.idEditar = idEditar;
    this.targetProducts = [];
    this.listarProdutosModal();

    produtosEditar.forEach(response => {
      const produtos = new Produtos()

      produtos.id = response.id;
      produtos.titulo = response.titulo;
      produtos.preco = response.preco;
      produtos.imagem = response.urlImagem

      this.targetProducts.push(produtos)
    })

    this.produtosSelecionadoGroup = this.formBuilder.group({
      copyPromo: [copy]
    })

    this.modal = true;
  }

  apagarProdutoPromo(id: number) {
    if (this.targetProducts.length === 1) {

      this.modal = false
      this.listarPromo()
      return;
    }
    this.promoService.apagarPromoProduto(this.idEditar, id).subscribe(response => {

      this.targetProducts = this.targetProducts.filter(produto => produto.id !== id);
      this.listarPromo()
      this.idEditar = 0;
    });
  }

  criarPost(produto: ProdutosPromo[], copy: string, id: number) {
    let estruturaCompartilhamento = copy + "\n\n";

    produto.forEach(item => {
      estruturaCompartilhamento += `*\u{1F4CC} ${item.titulo.substring(0, 60)}...* \n`;
      estruturaCompartilhamento += `\u{1F525} ${item.preco} \n\n`
    });

    estruturaCompartilhamento += `*\u{1F6D2} Compre Aqui: \u{1F447}* ${window.location.href.replace("painel/cadastrar-promo", '')}promos/${id}\n\n`;

    estruturaCompartilhamento += "_Promoção sujeita a alteração a qualquer momento_"

    this.clipboard.copy(estruturaCompartilhamento);
  }

  changePage(page: any) {
    this.pagePromo = page.page
    this.promoService.listarPromos(this.pagePromo, this.sizePromo).subscribe((response: any) => {
      this.promosProdutos = response.content
    });
  }

}
