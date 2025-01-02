import { ScraperService } from './../../../service/painel/scraper.service';
import { FormBuilder } from '@angular/forms';
import { ProdutoService } from './../../../service/painel/produto.service';
import { Component, OnInit } from '@angular/core';
import { ScraperProduto } from 'src/app/dto/ScraperProduto';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss']
})
export class ConfiguracoesComponent implements OnInit{

  imagemFile!: File;
  imagemView!: string;

  api = environment.apiUrl;

  check!: boolean
  tempoDoRobo!: number

  constructor(
    private produtoService: ProdutoService,
    private scraperService: ScraperService
  ) { }
  ngOnInit(): void {
    this.statusBot();
    this.buscarTempoRobo()
  }

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

  mudarTempoDoRobo(){
    this.scraperService.mudarTempoDoRobo(this.tempoDoRobo).subscribe(response => {
      
    })
  }

  buscarTempoRobo(){
    this.scraperService.buscarTempoDoRobo().subscribe(response => {
      this.tempoDoRobo = response;
    })
  }

  ativarBot(){
    this.scraperService.ativarBot(this.check).subscribe(response => {

    })
  }

  statusBot(){

    this.scraperService.statusBot().subscribe(response => {
      this.check = response
    })
  }
}
