import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostDTO, PostDTOGeral, PostsLista } from 'src/app/dto/postDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  salvaPost(post: any){
    return this.http.post<PostDTO>(`${this.apiUrl}/post/salvar`, post);
  }

  salvarImagem(formData: FormData){
    return this.http.post(`${this.apiUrl}/post/upload`, formData);
  }

  listarPosts(){
    return this.http.get<PostsLista[]>(`${this.apiUrl}/post`);
  }

  pegarPost(id: string){
    return this.http.get<PostDTOGeral>(`${this.apiUrl}/post/${id}`);
  }

  atualizarPost(post: any){
    return this.http.put(`${this.apiUrl}/post`, post);
  }

  apagarPost(id: number, urlImagem: string){
    const params = new HttpParams().set('id', id.toString()).set('urlImagem', urlImagem)
    return this.http.delete(`${this.apiUrl}/post`, {params})
  }
}
