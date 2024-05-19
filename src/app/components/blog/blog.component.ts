import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostDTO, PostDTOGeral, PostsLista } from 'src/app/dto/postDTO';
import { PostService } from 'src/app/service/painel/post.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {

  posts!: PostsLista[];

  post!: PostDTOGeral;

  apiUrl: string = environment.apiUrl

  id!: string;

  constructor(
    private postService: PostService,
    private router: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.id = this.router.snapshot.paramMap.get('id')!;
    if (this.id === null) {
      this.listarPosts();
    }else{
      this.pegarPost()
    }
  }

  listarPosts(){
    this.postService.listarPosts().subscribe(response => {
      this.posts = response
    })
  }

  pegarPost(){
    this.post = {
      urlImagem: "",
      id: 0,
      conteudo: "",
      titulo: "",
      dataAtualizacao: "",
      dataCriacao: ""
    }
    this.postService.pegarPost(this.id).subscribe(response => {
      this.post = response
    });
  }

  getTextWithoutTags(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }
}
