import { LojaService } from '../../../service/painel/loja.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Loja } from 'src/app/models/loja';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cadastrar-loja',
  templateUrl: './cadastrar-loja.component.html',
  styleUrls: ['./cadastrar-loja.component.scss'],
  providers: [MessageService]
})
export class CadastrarLojaComponent implements OnInit {

  lojaFormGroup!: FormGroup;

  apiurl: string = environment.apiUrl

  imagemFile!: File;
  // imagemBase64!: string;

  lojas!: Loja[];

  loja!: Loja;

  submitted: boolean = false;
  productDialog: boolean = false;
  selectedProducts!: Loja[] | null;

  id: number = 0;
  idEditar!: string;

  constructor(
    private formBuilder: FormBuilder,
    private lojaService: LojaService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.lojaFormGroup = this.formBuilder.group({
      nomeLoja: ['', Validators.required]
    })

    this.listarLojas();
  }

  openNew() {
    this.loja = {
      id: "",
      nome_loja: "",
      urlImagem: ""
    };
    this.submitted = false;
    this.productDialog = true;
  }

  onFileChange(event: any) {
    console.log(event.currentFiles)

    this.imagemFile = event.currentFiles[0]
    const reader = new FileReader();

    // reader.onload = (e) => {
    //   this.imagemBase64 = reader.result as string;
    // }

    reader.readAsDataURL(this.imagemFile);
  }

  salvarLoja() {

    this.id = parseInt(this.idEditar)

    if (this.loja == undefined && !this.lojaFormGroup.invalid) {

      const formData = new FormData();

      formData.append('file', this.imagemFile);
      formData.append('nomeLoja', this.lojaFormGroup.get('nomeLoja')?.value)

      this.lojaService.salvarLoja(formData).subscribe(response => {
        this.messageService.add({ severity: 'success', detail: 'Loja Salvo' });
        this.listarLojas();
        this.lojaFormGroup.reset()
      }, err => {
        this.messageService.add({ severity: 'error', detail: 'Erro ao Salvar Imagem' });
      });

      return;
    }

    if (this.loja !== undefined) {
      this.atualizarLoja();
      return
    }

    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Informe a Imagem e Nome' });
  }

  listarLojas() {
    this.lojaService.listarLojas().subscribe(response => {
      this.lojas = response
    });
  }

  pegarLoja(id: string) {
    this.lojaService.pegarLoja(id).subscribe(response => {
      this.loja = response
      console.log(this.loja)
      this.lojaFormGroup = this.formBuilder.group({
        nomeLoja: [this.loja.nome_loja, Validators.required]
      })
    });
  }

  apagarLoja(id: number, urlImagem: string) {
    this.lojaService.apagarLoja(id, urlImagem).subscribe(response => {
      this.messageService.add({ severity: 'success', detail: 'Loja Apagada' });
      this.lojas = [];
      this.listarLojas()
    }, err => {
      this.messageService.add({ severity: 'error', detail: 'Erro ao Apagar Loja' });
    })
  }

  atualizarLoja(){

    const formData = new FormData();

    formData.append('nomeLoja', this.lojaFormGroup.get('nomeLoja')?.value)
    formData.append('file', this.imagemFile);
    formData.append('id', this.loja.id)

    console.log(this.imagemFile)

    this.lojaService.atualizarLoja(formData).subscribe(response => {
      this.messageService.add({ severity: 'success', detail: 'Loja Atualizada' });
      this.lojas = [];
      this.listarLojas();
      this.lojaFormGroup = this.formBuilder.group({
        nomeLoja: ['', Validators.required]
      })
    }, err => {
      this.messageService.add({ severity: 'error', detail: 'Erro ao Atualizar Loja' });
    });
  }
}
