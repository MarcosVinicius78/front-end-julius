import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProdutoLoja } from 'src/app/dto/ProdutoLoja';
import { Categoria } from 'src/app/models/categoria';
import { Loja } from 'src/app/models/loja';
import { CategoriaService } from 'src/app/service/painel/categoria.service';
import { LojaService } from 'src/app/service/painel/loja.service';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { environment } from 'src/environments/environment';
import { ScraperProduto } from './../../../dto/ScraperProduto';

@Component({
  selector: 'app-cadastrar-produto',
  templateUrl: './cadastrar-produto.component.html',
  styleUrls: ['./cadastrar-produto.component.css'],
  providers: [MessageService]
})
export class CadastrarProdutoComponent implements OnInit {

  mensagem!: string;

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

  frete: any[] = [
    { name: "Frete Grátis" },
    { name: "Frete Grátis Algumas Regiões" },
    { name: "Frete Grátis Prime" },
    { name: "Frete Econômico" },
    { name: "Frete Grátis Retirando na Loja" }
  ];

  msg: any[] = [
    { name: "Promoção sujeita a alteração a qualquer momento" },
    { name: "Convide seus amigos: http://google.com.br" }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private produtoSevice: ProdutoService,
    private lojaService: LojaService,
    private categoriaService: CategoriaService,
    private router: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.idEditar = this.router.snapshot.paramMap.get('id')!;

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

    if (this.idEditar != undefined) {
      this.pegarProduto();
    }

    this.listarLojas()
    this.listarCategoria()
  }

  onFileChange(event: any) {
    this.imagemFile = event.target.files[0]


    const reader = new FileReader();

    reader.onload = (e) => {
      this.imagemView = reader.result as string;
    }

    reader.readAsDataURL(this.imagemFile);
  }

  salvarProduto() {

    this.id = parseInt(this.idEditar)

    console.log(this.scraperProduto)

    if (this.idEditar == null && !this.produtoFormGroup.invalid) {

      const produto: any = {
        titulo: this.produtoFormGroup.get('titulo')?.value,
        preco: this.produtoFormGroup.get('preco')?.value,
        precoParcelado: this.produtoFormGroup.get('precoParcelado')?.value,
        freteVariacoes: this.produtoFormGroup.get('freteVariacoes')?.value.name,
        mensagemAdicional: this.produtoFormGroup.get('mensagemAdicional')?.value.name,
        descricao: this.produtoFormGroup.get('descricao')?.value,
        link: this.produtoFormGroup.get('link')?.value,
        cupom: this.produtoFormGroup.get('cupom')?.value,
        urlImagem: this.scraperProduto.urlImagem,
        id_categoria: this.produtoFormGroup.get('id_categoria')?.value.categoria_id,
        id_loja: this.produtoFormGroup.get('loja')?.value.id,
        imagem: ['']
      }

      this.produtoSevice.salvarProduto(produto).subscribe(response => {

        this.id = response.id;

        if (this.scraperProduto.urlImagem === '' && this.imagemFile != undefined) {
          this.salvarImagem();
        }

        this.messageService.add({ severity: 'success', detail: 'Produto Salvo' });

      }, err => {
        console.log(err.status);
        this.messageService.add({ severity: 'error', detail: 'Erro ao salvar' });
      });

      this.imagemView = "";
      this.produtoFormGroup.reset()

      return;
    }


    if (this.idEditar !== null) {
      this.atualizarProduto();
      return
    }

    if (this.produtoFormGroup.get('url')?.value != "") {
      this.rasparProduto(this.produtoFormGroup.get('url')?.value)
      return
    }

    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Informe os Campos' });
    return;
  }

  salvarImagem() {
    const formData = new FormData();

    formData.append("file", this.imagemFile)
    formData.append("id", `${this.id}`);
    this.produtoSevice.salvarImagem(formData).subscribe(response => {
      return
    }, err => {
      console.log(err);
      this.messageService.add({ severity: 'error', detail: 'Erro ao Salvar Imagem' });
    });
  }

  atualizarProduto() {

    const produto: any = {
      id: this.idEditar,
      titulo: this.produtoFormGroup.get('titulo')?.value,
      preco: this.produtoFormGroup.get('preco')?.value,
      freteVariacoes: this.produtoFormGroup.get('freteVariacoes')?.value.name,
      mensagemAdicional: this.produtoFormGroup.get('mensagemAdicional')?.value.name,
      descricao: this.produtoFormGroup.get('descricao')?.value,
      link: this.produtoFormGroup.get('link')?.value,
      tituloPequeno: this.produtoFormGroup.get('tituloPequeno')?.value,
      cupom: this.produtoFormGroup.get('cupom')?.value,
      imagemUrl: this.produto.imagem,
      id_categoria: this.produtoFormGroup.get('id_categoria')?.value.categoria_id,
      id_loja: this.produtoFormGroup.get('loja')?.value
    }

    this.salvarImagem()

    this.produtoSevice.atualizarProduto(produto).subscribe(response => {
      this.messageService.add({ severity: 'success', detail: 'Produto Atualizado!' });
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
    }, err => {
      console.log(err);
      this.messageService.add({ severity: 'error', detail: 'Erro ao Recuperar Dados' });
    });
  }

  rasparProduto(url: string) {

    let loja: String = "";

    this.lojas.forEach(element => {
      if (url.includes(element.nome_loja.toLowerCase())) {
        loja = element.id;
      }
    });

    if (loja == "" && url.includes("amz")) {
      this.lojas.forEach(element => {
        if (element.nome_loja.toLowerCase().includes("amazon")) {
          loja = element.id;
        }
      });
    }

    if (loja === "") {
      this.lojas.forEach(element => {
        if (element.nome_loja.toLowerCase().includes("magazine")) {
          loja = element.id;
        }
      });
    }


    this.produtoSevice.rasparProduto(url).subscribe(response => {

      this.scraperProduto = response;


      this.produtoFormGroup = this.formBuilder.group({
        url: [''],
        titulo: [this.scraperProduto.nomeProduto, [Validators.required]],
        precoParcelado: [this.scraperProduto.precoParcelado],
        preco: [this.scraperProduto.precoProduto, [Validators.required]],
        mensagemAdicional: [''],
        freteVariacoes: [''],
        descricao: [''],
        link: [this.scraperProduto.urlProduto, Validators.required],
        cupom: [''],
        id_categoria: ['', [Validators.required]],
        loja: [loja, [Validators.required]],
        imgem: ['']
      })

      this.imagemView = "";
    }, err => {
      console.log(err)
      this.messageService.add({ severity: 'error', detail: 'Erro no Link' });
    });
  }


}
