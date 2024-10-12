import { Component, OnInit } from '@angular/core';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { LinkBannerService } from 'src/app/service/painel/link-banner.service';

@Component({
  selector: 'app-grupo-se',
  templateUrl: './grupo-se.component.html',
  styleUrl: './grupo-se.component.css'
})
export class GrupoSeComponent implements OnInit {

  links!: LinksBanner;

  constructor(
    private linkBannerService: LinkBannerService
  ){}

  ngOnInit(): void {
    this.pegarLinks()
  }

  pegarLinks(){
    this.linkBannerService.listarLinksEBanners().subscribe(response => {
      this.links = response;
      console.log(this.links.links.whatsapp)
    });
  }

}
