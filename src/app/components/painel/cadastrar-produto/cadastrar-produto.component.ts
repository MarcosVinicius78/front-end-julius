import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoLoja } from 'src/app/dto/ProdutoLoja';
import { Categoria } from 'src/app/models/categoria';
import { Loja } from 'src/app/models/loja';
import { Produtos } from 'src/app/models/produtos';
import { CategoriaService } from 'src/app/service/painel/categoria.service';
import { LojaService } from 'src/app/service/painel/loja.service';
import { ProdutoService } from 'src/app/service/painel/produto.service';

@Component({
  selector: 'app-cadastrar-produto',
  templateUrl: './cadastrar-produto.component.html',
  styleUrls: ['./cadastrar-produto.component.css']
})
export class CadastrarProdutoComponent implements OnInit {

  produtoFormGroup!: FormGroup;

  imagemFile!: File;
  imagemBase64!: string;
  categorias!: Categoria[];
  id: number = 0;
  idEditar!: string;

  produto!: ProdutoLoja;

  lojas!: Loja[];

  constructor(
    private formBuilder: FormBuilder,
    private produtoSevice: ProdutoService,
    private lojaService: LojaService,
    private categoriaService: CategoriaService,
    private router: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.idEditar = this.router.snapshot.paramMap.get('id')!;

    this.produtoFormGroup = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      tituloPequeno: ['', [Validators.required]],
      preco: ['', [Validators.required]],
      descricao: [''],
      link: ['', Validators.required],
      cupom: [''],
      id_categoria: ['', [Validators.required]],
      loja: ['', [Validators.required]],
      imgem: ['', Validators.required]
    })

    if (this.idEditar != undefined) {
      this.pegarProduto();
      console.log("aqui")
    }

    this.listarLojas()
    this.listarCategoria()
  }

  onFileChange(event: any) {
    this.imagemFile = event.target.files[0]
    const reader = new FileReader();

    reader.onload = (e) => {
      this.imagemBase64 = reader.result as string;
    }

    reader.readAsDataURL(this.imagemFile);
  }

  salvarProduto() {

    this.id = parseInt(this.idEditar)

    if (this.idEditar == undefined && !this.produtoFormGroup.invalid) {
      const produto: any = {
        titulo: this.produtoFormGroup.get('titulo')?.value,
        preco: this.produtoFormGroup.get('preco')?.value,
        descricao: this.produtoFormGroup.get('descricao')?.value,
        link: this.produtoFormGroup.get('link')?.value,
        tituloPequeno: this.produtoFormGroup.get('tituloPequeno')?.value,
        cupom: this.produtoFormGroup.get('cupom')?.value,
        imagemUrl: this.imagemBase64.split(',')[1],
        id_categoria: this.produtoFormGroup.get('id_categoria')?.value,
        id_loja: this.produtoFormGroup.get('loja')?.value
      }

      this.produtoSevice.salvarLoja(produto).subscribe(response => {
        this.id = response.id;
        alert("Salvo")
      });

      this.produtoFormGroup.reset()

      return;
    }


    if (this.idEditar !== undefined) {
      this.atualizarProduto();
      return
    }

    this.produtoFormGroup.markAllAsTouched()
    return;
  }

  atualizarProduto() {

    const produto: any = {
      id: this.idEditar,
      titulo: this.produtoFormGroup.get('titulo')?.value,
      preco: this.produtoFormGroup.get('preco')?.value,
      descricao: this.produtoFormGroup.get('descricao')?.value,
      link: this.produtoFormGroup.get('link')?.value,
      tituloPequeno: this.produtoFormGroup.get('tituloPequeno')?.value,
      cupom: this.produtoFormGroup.get('cupom')?.value,
      imagemUrl: this.produto.imagem,
      id_categoria: this.produtoFormGroup.get('id_categoria')?.value,
      id_loja: this.produtoFormGroup.get('loja')?.value
    }

    this.produtoSevice.atualizarProduto(produto).subscribe(response => {
      alert("Atualizado")
    });

  }

  listarLojas() {
    this.lojaService.listarLojas().subscribe(response => {
      this.lojas = response
    });
  }

  listarCategoria() {
    this.categoriaService.listarCategoria().subscribe(response => {
      this.categorias = response;
    })
  }

  pegarProduto() {
    this.produtoSevice.pegarProduto(this.idEditar).subscribe(response => {
      this.produto = response;
      this.imagemBase64 = this.produto.imagem

      this.produtoFormGroup = this.formBuilder.group({
        titulo: [this.produto.titulo],
        tituloPequeno: [this.produto.tituloPequeno],
        preco: [this.produto.preco],
        descricao: [this.produto.descricao],
        link: [this.produto.link],
        cupom: [this.produto.cupom],
        id_categoria: [this.produto.categoriaDto.categoria_id],
        loja: [this.produto.lojaResponseDto.id]
      })
    });
  }


}
