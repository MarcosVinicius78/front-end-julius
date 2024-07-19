import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LinkBannerService {


  apiUrl: string  = environment.apiUrl

  constructor(private http: HttpClient) { }

  salvarLinks(links: any){
    return this.http.put(`${this.apiUrl}/banners`, links);
  }

  listarLinksEBanners(){
    return this.http.get<LinksBanner>(`${this.apiUrl}/banners/links-site/${environment.site}`);
  }

  uploadImage(formData: FormData) {
    return this.http.post(`${this.apiUrl}/banners/upload`, formData);
  }

  apagarBanner(id: number){
    return this.http.delete(`${this.apiUrl}/banners/${id}`)
  }
}
