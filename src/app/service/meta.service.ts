import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(private meta: Meta) {}

  updateMetaTags(title: string, description: string, imageUrl: string) {

    this.meta.updateTag({ name: 'title', content: title });
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    // Adicione outras meta tags conforme necessário
  }
}
