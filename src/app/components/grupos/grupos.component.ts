import { LinkBannerService } from './../../service/painel/link-banner.service';
import { Component, OnInit } from '@angular/core';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit{

  links!: LinksBanner;

  constructor(
    private linkBannerService: LinkBannerService
  ){}

  ngOnInit(): void {
    this.pegarLinks()
  }

  pegarLinks(){
    this.linkBannerService.listarLinksEBanners().then(response => {
      this.links = response;
      console.log(this.links.links.whatsapp)
    });
  }

}
