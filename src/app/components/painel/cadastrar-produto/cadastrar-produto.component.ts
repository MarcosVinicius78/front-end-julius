import { ScraperProduto } from './../../../dto/ScraperProduto';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { parse } from 'date-fns';
import { ProdutoLoja } from 'src/app/dto/ProdutoLoja';
import { Categoria } from 'src/app/models/categoria';
import { Loja } from 'src/app/models/loja';
import { Produtos } from 'src/app/models/produtos';
import { CategoriaService } from 'src/app/service/painel/categoria.service';
import { LojaService } from 'src/app/service/painel/loja.service';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cadastrar-produto',
  templateUrl: './cadastrar-produto.component.html',
  styleUrls: ['./cadastrar-produto.component.css']
})
export class CadastrarProdutoComponent implements OnInit {

  produtoFormGroup!: FormGroup;
  apiUrl: string = environment.apiUrl;

  imagemFile!: File;
  imagemView!: string;

  categorias!: Categoria[];
  id: number = 0;
  idEditar!: string;

  link!: string;

  selectedFileSite: File | null = null;

  selectedFileWhatsapp: File | null = null;

  produto!: ProdutoLoja;

  lojas!: Loja[];

  scraperProduto = new ScraperProduto();

  constructor(
    private formBuilder: FormBuilder,
    private produtoSevice: ProdutoService,
    private lojaService: LojaService,
    private categoriaService: CategoriaService,
    private router: ActivatedRoute
  ) { }

  ngOnInit(): void {


    this.idEditar = this.router.snapshot.paramMap.get('id')!;


    // this.scraperProduto.urlImagem = "";

    this.produtoFormGroup = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      precoParcelado: [''],
      preco: ['', [Validators.required]],
      mensagemAdicional: [''],
      freteVariacoes: [''],
      descricao: [''],
      link: ['', Validators.required],
      cupom: [''],
      url: [''],
      id_categoria: ['', [Validators.required]],
      loja: ['', [Validators.required]],
      imgem: ['']
    })

    console.log(this.scraperProduto.urlImagem)

    if (this.idEditar != undefined) {
      this.pegarProduto();
    }

    this.listarLojas()
    this.listarCategoria()
  }

  // onFileSelectedSite(event: any) {
  //   this.selectedFileSite = event.target.files[0];
  // }

  // onFileSelectedWhatasapp(event: any) {
  //   this.selectedFileWhatsapp = event.target.files[0];
  // }

  onFileChange(event: any) {
    this.imagemFile = event.target.files[0]

    // this.scraperProduto.urlImagem = "";

    const reader = new FileReader();

    reader.onload = (e) => {
      this.imagemView = reader.result as string;
    }

    reader.readAsDataURL(this.imagemFile);
  }

  salvarProduto() {

    this.id = parseInt(this.idEditar)

    if (this.idEditar == null && !this.produtoFormGroup.invalid) {

      console.log("aqui")

      const produto: any = {
        titulo: this.produtoFormGroup.get('titulo')?.value,
        preco: this.produtoFormGroup.get('preco')?.value,
        precoParcelado: this.produtoFormGroup.get('precoParcelado')?.value,
        freteVariacoes: this.produtoFormGroup.get('freteVariacoes')?.value,
        mensagemAdicional: this.produtoFormGroup.get('mensagemAdicional')?.value,
        descricao: this.produtoFormGroup.get('descricao')?.value,
        link: this.produtoFormGroup.get('link')?.value,
        tituloPequeno: this.produtoFormGroup.get('tituloPequeno')?.value,
        cupom: this.produtoFormGroup.get('cupom')?.value,
        urlImagem: this.scraperProduto.urlImagem,
        id_categoria: this.produtoFormGroup.get('id_categoria')?.value,
        id_loja: this.produtoFormGroup.get('loja')?.value
      }

      console.log(produto);

      this.produtoSevice.salvarProduto(produto).subscribe(response => {

        this.id = response.id;

        if (this.scraperProduto.urlImagem == "") {
          const formData = new FormData();

          formData.append("file", this.imagemFile)
          formData.append("id", `${this.id}`);
          this.produtoSevice.salvarImagem(formData).subscribe(response => {
            alert("Salvo");
            return
          }, err => {
            console.log(err);
          });
        }
        alert("Salvo");
      }, err => {
        console.log(err.status);
      });

      this.imagemView = "";
      this.produtoFormGroup.reset()

      return;
    }


    if (this.idEditar !== null) {
      this.atualizarProduto();
      return
    }
    console.log(this.produtoFormGroup.get('url')?.value);

    if(this.produtoFormGroup.get('url')?.value != ""){
      // console.log(this.produtoFormGroup.get('url')?.value);
      this.rasparProduto(this.produtoFormGroup.get('url')?.value)
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
      freteVariacoes: this.produtoFormGroup.get('freteVariacoes')?.value,
      mensagemAdicional: this.produtoFormGroup.get('mensagemAdicional')?.value,
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

      this.imagemView = this.produto.imagem

      this.produtoFormGroup = this.formBuilder.group({
        titulo: [this.produto.titulo],
        tituloPequeno: [this.produto.tituloPequeno],
        preco: [this.produto.preco],
        freteVariacoes: [this.produto.freteVariacoes],
        mensagemAdicional: [this.produto.mensagemAdicional],
        descricao: [this.produto.descricao],
        link: [this.produto.link],
        cupom: [this.produto.cupom],
        id_categoria: [this.produto.categoriaDto.categoria_id],
        loja: [this.produto.lojaResponseDto.id]
      })
    });
  }

  rasparProduto(url: string){

    let loja: String = "";
    this.lojas.forEach(element => {
      if (url.includes(element.nome_loja.toLowerCase())) {
        loja = element.id;
      }
    });

    this.produtoSevice.rasparProduto(url).subscribe(response => {

      this.scraperProduto = response;

      this.produtoFormGroup = this.formBuilder.group({
        url: [''],
        titulo: [this.scraperProduto.nomeProduto, [Validators.required]],
        precoParcelado: [''],
        preco: [this.scraperProduto.precoProduto, [Validators.required]],
        mensagemAdicional: [''],
        freteVariacoes: [''],
        descricao: [''],
        link: [url, Validators.required],
        cupom: [''],
        id_categoria: ['', [Validators.required]],
        loja: [ loja, [Validators.required]],
        imgem: ['']
      })

      this.imagemView = "";
    }, err => {
      console.log(err)
    });
  }


}
