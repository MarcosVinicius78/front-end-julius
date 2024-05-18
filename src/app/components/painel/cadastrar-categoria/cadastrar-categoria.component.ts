import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from 'src/app/service/painel/categoria.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cadastrar-categoria',
  templateUrl: './cadastrar-categoria.component.html',
  styleUrls: ['./cadastrar-categoria.component.scss'],
  providers: [MessageService]
})
export class CadastrarCategoriaComponent implements OnInit {


  categoriaFormGroup!: FormGroup;
  categorias!: Categoria[];
  id!: number | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private messageService: MessageService
  ) { }


  ngOnInit(): void {
    console.log(this.id);
    this.categoriaFormGroup = this.formBuilder.group({
      nome_categoria: ['', Validators.required]
    })

    this.listarCategoria();
  }

  salvarCategoria(): any {

    if (this.id === undefined && !this.categoriaFormGroup.invalid) {
      const categoria = new Categoria(this.categoriaFormGroup.get(['nome_categoria'])?.value)

      this.categoriaService.salvarCategoria(categoria.nome_categoria).subscribe(response => {

        this.categorias.push(response);
        this.categoriaFormGroup.reset()
        this.messageService.add({ severity: 'success', detail: 'Categoria Salva' });
      },
        err => {
          this.messageService.add({ severity: 'error', detail: 'Erro ao Salvar' });
        }
      );

      return
    }

    if (this.id !== undefined) {
      this.atualizarCategoria()
      return;
    }

    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Informe o Nome da Categoria' });
  }

  listarCategoria() {
    this.categoriaService.listarCategoria().subscribe(response => {
      this.categorias = response;
    })
  }

  apagarCategoria(id: number) {

    this.categoriaService.apagarCategoria(id).subscribe(response => {
      this.listarCategoria();
      this.messageService.add({ severity: 'success', detail: 'Categoria Apagada' });
    });
  }

  pegarCategoria(id: number) {

    this.id = id;

    this.categoriaService.pegarCategoria(id).subscribe(response => {

      this.categoriaFormGroup = this.formBuilder.group({
        nome_categoria: [response.nome_categoria],
      })
    })
  }

  atualizarCategoria() {
    const categoria: any = {
      categoria_id: this.id,
      nome_categoria: this.categoriaFormGroup.get('nome_categoria')?.value,
      }

      this.categoriaService.atualizarCategoria(categoria).subscribe(response => {
        this.categoriaFormGroup.reset();
        this.id = undefined;
        this.listarCategoria();
        this.messageService.add({ severity: 'success', detail: 'Categoria Atualizada' });
      }, err => {
        this.messageService.add({ severity: 'error', detail: 'Erro ao Atualizar' });
      });
  }
}
