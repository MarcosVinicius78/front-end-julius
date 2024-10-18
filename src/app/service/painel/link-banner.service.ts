import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LinkBannerService {


  apiUrl: string = environment.apiUrl

  constructor(private http: HttpClient) { }

  salvarLinks(links: any) {
    return this.http.put(`${this.apiUrl}/banners`, links);
  }

  listarLinksEBanners(): Promise<LinksBanner> {
    return fetch(`${this.apiUrl}/banners/links-site/${environment.site}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Atribuir os dados à variável de classe se necessário
            return data as LinksBanner; // Certifique-se de que o tipo está correto
        })
        .catch(error => {
            console.error('Houve um problema com a requisição:', error);
            throw error;
        });
}


  uploadImage(formData: FormData) {
    return this.http.post(`${this.apiUrl}/banners/upload`, formData);
  }

  apagarBanner(id: number) {
    return this.http.delete(`${this.apiUrl}/banners/${id}`)
  }

  editarBanner(bannerId: number, file: File | null, fileMobile: File | null, nome: string, link: string) {
    const formData: FormData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (fileMobile) {
      formData.append('fileMobile', fileMobile);
    }
    formData.append('nome', nome);
    formData.append('link', link);

    return this.http.put(`${this.apiUrl}/banners/${bannerId}`, formData);
  }
}
