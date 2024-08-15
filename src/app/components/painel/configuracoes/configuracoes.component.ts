import { ProdutoService } from './../../../service/painel/produto.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss']
})
export class ConfiguracoesComponent {

  imagemFile!: File;
  imagemView!: string;

  constructor(
    private produtoService: ProdutoService
  ) { }

  onFileChange(event: any) {
    console.log(event.currentFiles)

    this.imagemFile = event.currentFiles[0]
    const reader = new FileReader();

    reader.readAsDataURL(this.imagemFile);
  }

  salvarStory() {

    const formData = new FormData();
    formData.append('file', this.imagemFile);

    this.produtoService.salvarStory(formData).subscribe(response => {
      alert("Story Salvo")
    }, err => {

    })
  }
}
