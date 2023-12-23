import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from 'src/app/service/painel/categoria.service';

@Component({
  selector: 'app-cadastrar-categoria',
  templateUrl: './cadastrar-categoria.component.html',
  styleUrls: ['./cadastrar-categoria.component.css']
})
export class CadastrarCategoriaComponent implements OnInit {


  categoriaFormGroup!: FormGroup;
  categorias!: Categoria[];
  id!: number | undefined;

  constructor(private formBuilder: FormBuilder, private categoriaService: CategoriaService) { }


  ngOnInit(): void {
    this.categoriaFormGroup = this.formBuilder.group({
      nome_categoria: ['', Validators.required]
    })

    this.listarCategoria();
  }

  salvarCategoria(): any {

    if (this.id === undefined && !this.categoriaFormGroup.invalid) {
      const categoria = new Categoria(this.categoriaFormGroup.get(['nome_categoria'])?.value)

      this.categoriaService.salvarCategoria(categoria).subscribe(response => {

        this.categorias.push(response);
        this.categoriaFormGroup.reset()
      },
        err => {
          console.log(err);
        }
      );
    }

    if (this.id !== undefined) {
      this.atualizar()
    }

  }

  listarCategoria() {
    this.categoriaService.listarCategoria().subscribe(response => {
      this.categorias = response;
    })
  }

  apagarCategoria(id: number) {

    this.categoriaService.apagarCategoria(id).subscribe(response => {
      this.listarCategoria();
    });
  }

  editarCategoria(id: number) {

    this.id = id;

    this.categoriaService.pegarCategoria(id).subscribe(response => {

      this.categoriaFormGroup = this.formBuilder.group({
        nome_categoria: [response.nome_categoria],
      })
    })
  }

  atualizar() {
    const categoria: any = {
      categoria_id: this.id,
      nome_categoria: this.categoriaFormGroup.get('nome_categoria')?.value,
      }

      this.categoriaService.atualizarCategoria(categoria).subscribe(response => {
        alert("Categoria Atualizada")
        this.categoriaFormGroup.reset();
        this.id = undefined;
        this.listarCategoria();
      }, err => {
        alert("Erro ao atualizar")
      });
  }
}
