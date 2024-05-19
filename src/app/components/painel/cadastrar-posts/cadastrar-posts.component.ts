import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from 'src/app/service/painel/post.service';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { PostDTOGeral } from 'src/app/dto/postDTO';

@Component({
  selector: 'app-cadastrar-posts',
  templateUrl: './cadastrar-posts.component.html',
  styleUrls: ['./cadastrar-posts.component.scss'],
  providers: [MessageService]
})
export class CadastrarPostsComponent implements OnInit {

  apiUrl: string = environment.apiUrl;

  text: string = "";
  titulo: string = "";
  id: number = 0;
  idEditar!: string;

  imagemFile!: File;
  imageUrl!: string;
  fileForm!: FormGroup;

  post!: PostDTOGeral;

  constructor(
    private postService: PostService,
    private messageService: MessageService,
    private router: ActivatedRoute
  ) { }

  ngOnInit() {

    this.idEditar = this.router.snapshot.paramMap.get('id')!;

    if (this.idEditar !== null) {
      this.pegarPost();

    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.imagemFile = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  salvarPost() {

    if (this.titulo !== "" && this.text !== undefined && this.idEditar === null) {

      const post: any = {
        titulo: this.titulo,
        conteudo: this.text
      }
      this.postService.salvaPost(post).subscribe(response => {

        if (response.id !== undefined) {
          this.salvarImagem(response.id);
        }

        this.titulo = "";
        this.text = "";
        return
      }, err => {
        console.log(err);
      });

      return;
    }

    if (this.idEditar !== null) {
      const post = {
        id: this.idEditar,
        titulo: this.titulo,
        conteudo: this.text
      }

      this.atualizarPost(post);
    }

    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Informe os Campos' });
    return;
  }

  atualizarPost(post: any) {
    this.postService.atualizarPost(post).subscribe(response => {
      this.messageService.add({ severity: 'success', detail: 'Post Atualizado' });
      console.log(response);
    }, err=> {
      this.messageService.add({ severity: 'error', detail: 'Erro ao Atualizar' });

    });

    return;
  }

  salvarImagem(id: number) {

    const formData = new FormData();

    formData.append("file", this.imagemFile);
    formData.append("id", `${id}`);

    this.postService.salvarImagem(formData).subscribe(response => {
      this.messageService.add({ severity: 'success', detail: 'Post Salvo' });
      this.imageUrl = ""
    }, err => {
      this.messageService.add({ severity: 'error', detail: 'Erro ao Salvar Imagem' });
      console.log(err)
    })
  }

  pegarPost() {
    this.post = {
      urlImagem: "",
      id: 0,
      conteudo: "",
      titulo: "",
      dataAtualizacao: "",
      dataCriacao: ""
    }
    this.postService.pegarPost(this.idEditar).subscribe(response => {
      this.post = response
      this.titulo = this.post.titulo
      this.text = this.post.conteudo
    });
  }

}
