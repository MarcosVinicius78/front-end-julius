import { LojaService } from '../../../service/painel/loja.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Loja } from 'src/app/models/loja';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cadastrar-loja',
  templateUrl: './cadastrar-loja.component.html',
  styleUrls: ['./cadastrar-loja.component.css']
})
export class CadastrarLojaComponent implements OnInit{

  lojaFormGroup!: FormGroup;

  apiurl: string = environment.apiUrl

  imagemFile!: File;
  imagemBase64!: string;

  lojas!: Loja[];

  constructor(private formBuilder: FormBuilder, private lojaService: LojaService){}

  ngOnInit(): void {
    this.lojaFormGroup = this.formBuilder.group({
      nomeLoja: ['', Validators.required],
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

      const formData = new FormData();

      formData.append('file', this.imagemFile);
      formData.append('nomeLoja', this.lojaFormGroup.get('nomeLoja')?.value)
      console.log(formData)

      this.lojaService.salvarLoja(formData).subscribe( response => {
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
