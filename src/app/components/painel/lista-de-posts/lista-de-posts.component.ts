import { Post } from './../../../models/post';
import { PostService } from 'src/app/service/painel/post.service';
import { Component, OnInit } from '@angular/core';
import { PostsLista } from 'src/app/dto/postDTO';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-lista-de-posts',
  templateUrl: './lista-de-posts.component.html',
  styleUrls: ['./lista-de-posts.component.scss'],
  providers: [MessageService]
})
export class ListaDePostsComponent implements OnInit{

  posts!: PostsLista[];

  apiUrl: string = environment.apiUrl

  constructor(
    private postService: PostService,
    private messageService: MessageService
  ){}

  ngOnInit(): void {
    this.listarPosts();
  }

  listarPosts(){
    this.postService.listarPosts().subscribe(response => {
      this.posts = response
    })
  }

  apagarPost(id: number, urlImagem: string){
    this.postService.apagarPost(id, urlImagem).subscribe(response => {
      this.listarPosts()
      this.messageService.add({ severity: 'success', detail: 'Post Atualizado' });
    });
  }

  getTextWithoutTags(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
}
