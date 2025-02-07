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
import { ImagemServiceService } from 'src/app/service/painel/imagem-service.service';

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
    private messageService: MessageService,
    public imagemService: ImagemServiceService
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

  resetarForm() {
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
      copy: [''],
      link: ['']
    })

  }

  onFileChange(event: File): void {
    if (event) {
      this.imagemFile = event;
      const reader = new FileReader();
      reader.onload = () => this.imagemView = reader.result as string; // Atualiza apenas imagemView
      reader.readAsDataURL(event);
    }
  }

  onFileChangeSocial(event: any): void {
    if (event) {
      this.imagemFileSocial = event
      const reader = new FileReader();
      reader.onload = () => this.imagemViewSocial = reader.result as string; // Atualiza apenas imagemViewSocial
      reader.readAsDataURL(event);
    }
  }

  private montarProduto(): any {
    return {
      id: this.idEditar,
      copy: this.produtoFormGroup.get('copy')?.value,
      titulo: this.produtoFormGroup.get('titulo')?.value,
      preco: this.produtoFormGroup.get('preco')?.value,
      precoParcelado: this.produtoFormGroup.get('check')?.value ? "sem juros" : "",
      freteVariacoes: this.produtoFormGroup.get('freteVariacoes')?.value,
      mensagemAdicional: this.extrairValor('mensagemAdicional'),
      linkSe: this.produtoFormGroup.get('link_se')?.value,
      linkOmc: this.produtoFormGroup.get('link_ofm')?.value,
      cupomSe: this.extrairValor("cupom"),
      cupomOmc: this.extrairValor("cupomOmc"),
      urlImagem: this.scraperProduto.urlImagem,
      idCategoria: this.produtoFormGroup.get('id_categoria')?.value,
      idLoja: this.produtoFormGroup.get('loja')?.value,
      descricao: this.produtoFormGroup.get('descricao')?.value,
      link: this.produtoFormGroup.get('link')?.value
    };
  }

  private extrairValor(campo: string): any {
    const valor = this.produtoFormGroup.get(campo)?.value;
    return valor && typeof valor === 'object' && 'name' in valor ? valor.name : valor;
  }

  private resetarDados(): void {
    Object.assign(this.scraperProduto, {
      urlImagem: '',
      urlProdutoSe: '',
      urlProdutoOfm: ''
    });

    this.imagemViewSocial = '';
    this.imagemFile = {} as File;
    this.imagemFileSocial = {} as File;
    this.imagemView = '';

    this.resetarForm();
  }

  salvarProduto() {

    

    if (this.idEditar == null && !this.produtoFormGroup.invalid) {
      const temImagem = this.scraperProduto.urlImagem || this.imagemFile || this.imagemFileSocial;
      if (!temImagem) {
        this.messageService.add({ severity: 'warn', detail: 'É necessário selecionar pelo menos uma imagem!' });
        return;
      }

      const produto = this.montarProduto();

      this.produtoSevice.salvarProduto(produto).subscribe({
        next: response => {
          this.id = response.id;
          this.idOmc = response.idOmc;

          if (this.imagemFile || this.imagemFileSocial) {
            this.salvarImagem();
          }

          this.resetarDados();
          this.messageService.add({ severity: 'success', detail: 'Produto Salvo' });
        },
        error: err => {
          console.error(err);
          this.messageService.add({ severity: 'error', detail: 'Erro ao salvar' });
        }
      });

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

    formData.append("urlImagem", this.imagemFile);
    formData.append("urlImagemReal", this.imagemFileSocial);

    this.imagemService.salvarImagem(formData).subscribe({
      next: () => this.messageService.add({ severity: 'success', detail: 'Imagem Salva!' }),
      error: (error) => this.messageService.add({ severity: 'error', detail: 'Erro ao Salvar Imagem' })
    })
  }

  atualizarProduto() {

    const produto = this.montarProduto();

    console.log(produto);

    if (this.imagemFile || this.imagemFileSocial) {
      this.salvarImagem();
    }

    this.produtoSevice.atualizarProduto(produto).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', detail: 'Produto Atualizado!' });
      },
      error: () => this.messageService.add({ severity: 'error', detail: 'Error ao Atualizado!' })
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
      this.categorias = response.content;
    })
  }

  pegarProduto() {

    this.produtoSevice.pegarProduto(this.idEditar, 0).subscribe({
      next: (response) => {
        this.produto = response;
        this.id = response.id

        if (this.produto.linkSiteOmc === null) {
          this.cupomOmc = false
        }

        this.produtoFormGroup = this.formBuilder.group({
          titulo: [this.produto.titulo],
          preco: [this.produto.preco],
          check: [this.produto.parcelado != null && this.produto.parcelado.includes("sem juros") ? true : false],
          freteVariacoes: [this.produto.freteVariacoes],
          mensagemAdicional: [this.produto.mensagemAdicional],
          descricao: [this.produto.linkAppSe],
          link_se: [this.produto.linkSiteSe],
          link_ofm: [this.produto.linkSiteOmc],
          cupom: [this.produto.cupom],
          cupomOmc: [null],
          id_categoria: [this.produto.categoriaDto.categoria_id],
          loja: [this.produto.lojaResponseDto.id],
          copy: [this.produto.copy]
        })

      },
      error: () => this.messageService.add({ severity: 'error', detail: 'Erro ao Recuperar Dados' })
    });
  }

  rasparProduto(url: string) {
    let loja = this.lojas.find(element =>
      url.includes(element.nome_loja.toLowerCase().replace(' ', ''))
    )?.id || "";

    if (!loja) {
      const palavrasChave = ["amz", "shopee", "mercado"];
      loja = this.lojas.find(element =>
        palavrasChave.some(chave => url.includes(chave) && element.nome_loja.toLowerCase().includes(chave))
      )?.id || "";
    }

    // Tratamento especial para "magazine"
    if (!loja) {
      loja = this.lojas.find(element =>
        element.nome_loja.toLowerCase().includes("magazine")
      )?.id || "";
    }

    this.cuponsSE = Array.from({ length: 10 }, (_, i) => ({ name: `${(i + 1) * 10}SERGIPEEOFERTAS` }));

    this.produtoSevice.rasparProduto(url).subscribe(response => {
      this.scraperProduto = response;

      this.produtoFormGroup = this.formBuilder.group({
        url: [''],
        titulo: [response.nomeProduto, [Validators.required]],
        check: [response.precoParcelado.includes("sem juros")],
        preco: [response.precoProduto, [Validators.required]],
        mensagemAdicional: ['Promoção sujeita a alteração a qualquer momento'],
        freteVariacoes: [''],
        cupomOmc: [''],
        link_se: [response.urlProdutoSe],
        link_ofm: [response.urlProdutoOfm],
        cupom: [''],
        id_categoria: ['', [Validators.required]],
        loja: [loja, [Validators.required]],
        imgem: [''],
        imgemSocial: [''],
        copy: [''],
        link: [response.urlProdutoSe],
        descricao: [response.urlProdutoOfm]
      });

      this.imagemView = "";
      this.imagemViewSocial = "";
    }, err => {
      this.messageService.add({ severity: 'error', detail: 'Erro no Link' });
    });
  }
}
