import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImagemServiceService {

    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getImagemUrl(local: string, imagem: string): string {
      return `${this.apiUrl}/imagem/download/${local}/${imagem}`;
    }

    salvarImagem(formData: FormData) {
      return this.http.post(`${this.apiUrl}/imagem/upload`, formData);
    }
}
