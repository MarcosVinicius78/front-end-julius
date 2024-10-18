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
  styleUrls: ['./cadastrar-produto.component.scss'],
  providers: [MessageService]
})
export class CadastrarProdutoComponent implements OnInit {

  mensagem!: string;

  cuponsSE!: any[] | undefined;
  mensagemAdicional!: any[] | undefined;
  cuponsOMC!: any[] | undefined;
  cupomSelecionadoSE!: any | undefined;
  cupomSelecionadoOMC!: string | undefined;
  mensagemSelecionada!: string | undefined;

  produtoFormGroup!: FormGroup;
  apiUrl: string = environment.apiUrl;

  imagemFile!: File;
  imagemView!: string;
  imagemFileSocial!: File;
  imagemViewSocial!: string;

  categorias!: Categoria[];
  id: number = 0;
  idOmc: number = 0;
  idEditar!: string;

  link!: string;

  selectedFileSite: File | null = null;

  selectedFileWhatsapp: File | null = null;

  produto = new ProdutoLoja();

  lojas!: Loja[];

  scraperProduto = new ScraperProduto();

  cupomOmc: boolean = true;

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

    this.cuponsSE = [
      { name: '10SERGIPEEOFERTAS' },
      { name: '20SERGIPEEOFERTAS' },
      { name: '30SERGIPEEOFERTAS' },
      { name: '40SERGIPEEOFERTAS' },
      { name: '50SERGIPEEOFERTAS' },
      { name: '60SERGIPEEOFERTAS' },
      { name: '70SERGIPEEOFERTAS' },
      { name: '80SERGIPEEOFERTAS' },
      { name: '90SERGIPEEOFERTAS' },
      { name: '100SERGIPEEOFERTAS' }
    ]

    this.cuponsOMC = [
      { name: '10OFERTASMAISCUPOM' },
      { name: '20OFERTASMAISCUPOM' },
      { name: '30OFERTASMAISCUPOM' },
      { name: '40OFERTASMAISCUPOM' },
      { name: '50OFERTASMAISCUPOM' },
      { name: '60OFERTASMAISCUPOM' },
      { name: '70OFERTASMAISCUPOM' },
      { name: '80OFERTASMAISCUPOM' },
      { name: '90OFERTASMAISCUPOM' },
      { name: '100OFERTASMAISCUPOM' },
    ]
    this.mensagemAdicional = [
      { name: "Promoção sujeita a alteração a qualquer momento" },
      { name: "Compartilhe com seus Amigos" }
    ]

    this.resetarForm()


    if (this.idEditar != undefined) {
      this.pegarProduto();
    }

    this.listarLojas()
    this.listarCategoria()
  }

  resetarForm(){
    this.produtoFormGroup = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      preco: ['', [Validators.required]],
      check: [false],
      mensagemAdicional: ['Promoção sujeita a alteração a qualquer momento'],
      freteVariacoes: [''],
      cupomOmc: [''],
      link_se: [''],
      link_ofm: [''],
      cupom: [''],
      url: [''],
      id_categoria: ['', [Validators.required]],
      loja: ['', [Validators.required]],
      imgem: [''],
      imgemSocial: [''],
      copy: ['']
    })

  }

  onFileChange(event: any) {
    this.imagemFile = event.target.files[0]

    if (this.produto != undefined && this.produto.imagem != undefined) {
      this.produto.imagem = "";
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      this.imagemView = reader.result as string;
    }

    reader.readAsDataURL(this.imagemFile);
  }

  onFileChangeSocial(event: any) {
    this.imagemFileSocial = event.target.files[0]

    if (this.produto !== undefined) {
      this.produto.imagemSocial = ""
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      this.imagemViewSocial = reader.result as string;
    }

    reader.readAsDataURL(this.imagemFileSocial);
  }

  salvarProduto() {

    this.id = parseInt(this.idEditar)

    let parcelado = "";

    if (this.idEditar == null && !this.produtoFormGroup.invalid) {

      if (this.produtoFormGroup.get('check')?.value === true) {
        parcelado = "sem juros"
      }

      console.log(this.produtoFormGroup.get('cupom')?.value)

      const produto: any = {
        titulo: this.produtoFormGroup.get('titulo')?.value,
        preco: this.produtoFormGroup.get('preco')?.value,
        precoParcelado: parcelado,
        freteVariacoes: this.produtoFormGroup.get('freteVariacoes')?.value,
        mensagemAdicional: this.produtoFormGroup.get('mensagemAdicional')?.value['name'] === undefined ? this.produtoFormGroup.get('mensagemAdicional')?.value : this.produtoFormGroup.get('mensagemAdicional')?.value['name'],
        link_se: this.produtoFormGroup.get('link_se')?.value,
        link_ofm: this.produtoFormGroup.get('link_ofm')?.value,
        cupom: this.produtoFormGroup.get('cupom')?.value === undefined || this.produtoFormGroup.get('cupom')?.value.length > 1 ? this.produtoFormGroup.get('cupom')?.value : this.produtoFormGroup.get('cupom')?.value['name'],
        cupomOmc: this.produtoFormGroup.get('cupomOmc')?.value === undefined || this.produtoFormGroup.get('cupomOmc')?.value.length > 1 ? this.produtoFormGroup.get('cupomOmc')?.value : this.produtoFormGroup.get('cupomOmc')?.value['name'],
        urlImagem: this.scraperProduto.urlImagem,
        id_categoria: this.produtoFormGroup.get('id_categoria')?.value,
        id_loja: this.produtoFormGroup.get('loja')?.value,
        imagem: [''],
        copy: this.produtoFormGroup.get('copy')?.value
      }

      this.produtoSevice.salvarProduto(produto).subscribe(response => {

        this.id = response.id;
        this.idOmc = response.idOmc

        if (this.scraperProduto.urlImagem === '' && this.imagemFile !== undefined) {

          this.salvarImagem();
        }

        if (this.imagemFileSocial !== undefined) {
          this.salvarImagem();
        }

        this.scraperProduto.urlImagem = '';
        this.scraperProduto.urlProdutoSe = '';
        this.scraperProduto.urlProdutoOfm = '';
        this.imagemViewSocial = '';
        this.imagemFile = {} as File;
        this.imagemFileSocial = {} as File;

        this.messageService.add({ severity: 'success', detail: 'Produto Salvo' });
      }, err => {
        console.log(err.status);
        this.messageService.add({ severity: 'error', detail: 'Erro ao salvar' });
      });

      this.imagemView = "";
      this.resetarForm()

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

    this.produtoFormGroup.markAllAsTouched();
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Informe os Campos' });
    return;
  }

  salvarImagem() {
    const formData = new FormData();
    formData.append("id", `${this.id}`);
    formData.append("idOmc", `${this.idOmc}`);

    console.log(this.idOmc)
    if (this.scraperProduto.urlImagem === '') {
      formData.append("file", this.imagemFile)
      formData.append("fileSocial", this.imagemFileSocial)
    }

    if (this.scraperProduto.urlImagem !== '' && this.imagemFileSocial !== undefined) {
      formData.append("fileSocial", this.imagemFileSocial)
    }

    if (this.produto.id != 0) {
      formData.append("urlImagem", this.produto.imagem);
      formData.append("urlImagemReal", this.produto.imagemSocial);
    }

    this.produtoSevice.salvarImagem(formData).subscribe(response => {

      this.messageService.add({ severity: 'success', detail: 'Imagem Salva!' });
      return
    }, err => {
      console.log(err);
      this.messageService.add({ severity: 'error', detail: 'Erro ao Salvar Imagem' });
    });
  }

  atualizarProduto() {

    let parcelado = "";

    if (this.produtoFormGroup.get('check')?.value === true) {
      console.log("teste aqui")
      parcelado = "sem juros"
    }

    const produto: any = {
      id: this.idEditar,
      titulo: this.produtoFormGroup.get('titulo')?.value,
      preco: this.produtoFormGroup.get('preco')?.value,
      precoParcelado: parcelado,
      freteVariacoes: this.produtoFormGroup.get('freteVariacoes')?.value,
      mensagemAdicional: this.produtoFormGroup.get('mensagemAdicional')?.value['name'] === undefined ? this.produtoFormGroup.get('mensagemAdicional')?.value : this.produtoFormGroup.get('mensagemAdicional')?.value['name'],
      link_se: this.produtoFormGroup.get('link_se')?.value,
      link_ofm: this.produtoFormGroup.get('link_ofm')?.value,
      cupom: this.produtoFormGroup.get('cupom')?.value === null || this.produtoFormGroup.get('cupom')?.value.length > 1 ? this.produtoFormGroup.get('cupom')?.value : this.produtoFormGroup.get('cupom')?.value['name'],
      cupomOmc: this.produtoFormGroup.get('cupomOmc')?.value === null || this.produtoFormGroup.get('cupomOmc')?.value.length > 1 ? this.produtoFormGroup.get('cupomOmc')?.value : this.produtoFormGroup.get('cupomOmc')?.value['name'],
      urlImagem: "",
      id_categoria: this.produtoFormGroup.get('id_categoria')?.value,
      id_loja: this.produtoFormGroup.get('loja')?.value,
      copy: this.produtoFormGroup.get('copy')?.value
    }

    if (this.imagemFile !== undefined || this.imagemFileSocial !== undefined) {
      this.salvarImagem();
    }

    this.produtoSevice.atualizarProduto(produto).subscribe(response => {
      this.messageService.add({ severity: 'success', detail: 'Produto Atualizado!' });
    }, err => {
      this.messageService.add({ severity: 'error', detail: 'Error ao Atualizado!' });
    });

    return

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

    this.produtoSevice.pegarProduto(this.idEditar, 0).subscribe(response => {
      this.produto = response;
      this.id = response.id

      if (this.produto.link_ofm === null) {
        this.cupomOmc = false
      }

      console.log(this.produto.parcelado)

      this.produtoFormGroup = this.formBuilder.group({
        titulo: [this.produto.titulo],
        preco: [this.produto.preco],
        check: [this.produto.parcelado != null && this.produto.parcelado.includes("sem juros") ? true : false],
        freteVariacoes: [this.produto.freteVariacoes],
        mensagemAdicional: [this.produto.mensagemAdicional],
        descricao: [this.produto.descricao],
        link_se: [this.produto.link_se],
        link_ofm: [this.produto.link_ofm],
        cupom: [this.produto.cupom],
        cupomOmc: [null],
        id_categoria: [this.produto.categoriaDto.categoria_id],
        loja: [this.produto.lojaResponseDto.id],
        copy: [this.produto.copy]
      })

    }, err => {
      console.log(err);
      this.messageService.add({ severity: 'error', detail: 'Erro ao Recuperar Dados' });
    });
  }

  rasparProduto(url: string) {

    let loja: String = "";

    this.lojas.forEach(element => {
      if (url.includes(element.nome_loja.toLowerCase().replace(' ', ''))) {
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

    if (loja == "" && url.includes("shopee")) {
      this.lojas.forEach(element => {
        if (element.nome_loja.toLowerCase().includes("shopee")) {
          loja = element.id;
        }
      });
    }

    if (loja == "" && url.includes("mercado")) {
      this.lojas.forEach(element => {
        if (element.nome_loja.toLowerCase().includes("mercado")) {
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

    let parcelado = "";

    if (this.produtoFormGroup.get('check')?.value === true) {
      console.log("teste aqui")
      parcelado = "sem juros"
    }

    this.cuponsSE = [
      { name: '10SERGIPEEOFERTAS' },
      { name: '20SERGIPEEOFERTAS' },
      { name: '30SERGIPEEOFERTAS' },
      { name: '40SERGIPEEOFERTAS' },
      { name: '50SERGIPEEOFERTAS' },
      { name: '60SERGIPEEOFERTAS' },
      { name: '70SERGIPEEOFERTAS' },
      { name: '80SERGIPEEOFERTAS' },
      { name: '90SERGIPEEOFERTAS' },
      { name: '100SERGIPEEOFERTAS' }
    ]

    this.produtoSevice.rasparProduto(url).subscribe(response => {

      this.scraperProduto = response;

      this.produtoFormGroup = this.formBuilder.group({
        url: [''],
        titulo: [this.scraperProduto.nomeProduto, [Validators.required]],
        check: [response.precoParcelado.includes("sem juros") ? true : false],
        preco: [this.scraperProduto.precoProduto, [Validators.required]],
        mensagemAdicional: ['Promoção sujeita a alteração a qualquer momento'],
        freteVariacoes: [''],
        cupomOmc: [''],
        link_se: [this.scraperProduto.urlProdutoSe],
        link_ofm: [this.scraperProduto.urlProdutoOfm],
        cupom: [''],
        id_categoria: ['', [Validators.required]],
        loja: [loja, [Validators.required]],
        imgem: [''],
        imgemSocial: [''],
        copy: ['']
      })


      this.imagemView = "";
      this.imagemViewSocial = "";
    }, err => {
      console.log(err)
      this.messageService.add({ severity: 'error', detail: 'Erro no Link' });
    });
  }


}
