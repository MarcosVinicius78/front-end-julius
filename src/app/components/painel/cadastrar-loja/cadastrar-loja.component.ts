import { LojaService } from '../../../service/painel/loja.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Loja } from 'src/app/models/loja';

@Component({
  selector: 'app-cadastrar-loja',
  templateUrl: './cadastrar-loja.component.html',
  styleUrls: ['./cadastrar-loja.component.css']
})
export class CadastrarLojaComponent implements OnInit{

  lojaFormGroup!: FormGroup;

  imagemFile!: File;
  imagemBase64!: string;

  lojas!: Loja[];

  constructor(private formBuilder: FormBuilder, private lojaService: LojaService){}

  ngOnInit(): void {
    this.lojaFormGroup = this.formBuilder.group({
      nome_loja: ['', Validators.required],
      imagem: [null]
    })

    this.listarLojas();
  }

  onFileChange(event: any){
    this.imagemFile = event.target.files[0]
    const reader = new FileReader();

    reader.onload = (e) => {
      this.imagemBase64 = reader.result as string;
    }

    reader.readAsDataURL(this.imagemFile);
  }

  salvarLoja() {

    if (!this.lojaFormGroup.invalid) {
      const loja = {
        nome_loja: this.lojaFormGroup.get('nome_loja')?.value,
        url_imagem: this.imagemBase64.split(',')[1]
      }

      this.lojaService.salvarLoja(loja).subscribe( response => {
        this.listarLojas();
        this.lojaFormGroup.reset()
      });
    }
  }

  listarLojas(){
    this.lojaService.listarLojas().subscribe( response => {
      this.lojas = response
    });
  }

}
