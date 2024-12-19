import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { PostDTO, PostDTOGeral, PostsLista } from 'src/app/dto/postDTO';
import { AnaliseService } from 'src/app/service/painel/analise.service';
import { LinkBannerService } from 'src/app/service/painel/link-banner.service';
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
  links!: LinksBanner;

  apiUrl: string = environment.apiUrl

  id!: string;

  analiseService = inject(AnaliseService)

  constructor(
    private postService: PostService,
    private router: ActivatedRoute,
    private linkBannerService: LinkBannerService
  ){}

  ngOnInit(): void {
    this.id = this.router.snapshot.paramMap.get('id')!;
    this.pegarLinks()
    if (this.id === null) {
      this.listarPosts();
    }else{
      this.pegarPost();
    }
  }

  registrarAcessoSistema() {
    if (!sessionStorage.getItem('acessoRegistradoHome')) {
      this.analiseService.registrarEvento('ACESSO_SISTEMA').subscribe(() => {
        sessionStorage.setItem('acessoRegistradoHome', 'true');
      });
    }
  }

  listarPosts(){
    this.postService.listarPosts().subscribe(response => {
      this.posts = response
      this.registrarAcessoSistema()
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

  pegarLinks(){
    this.linkBannerService.listarLinksEBanners().then(response => {
      this.links = response;
    });
  }
}
