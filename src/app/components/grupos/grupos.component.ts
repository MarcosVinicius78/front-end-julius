import { LinkBannerService } from './../../service/painel/link-banner.service';
import { Component, OnInit } from '@angular/core';
import { LinksBanner } from 'src/app/dto/LinksBanner';

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
    this.linkBannerService.listarLinksEBanners().subscribe(response => {
      this.links = response;
    });
  }

}
