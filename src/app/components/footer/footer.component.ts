import { Component, OnInit } from '@angular/core';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { LinkBannerService } from 'src/app/service/painel/link-banner.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit{

  links = new LinksBanner();

  constructor(
    private linkBannerService: LinkBannerService,
  ){}
  ngOnInit(): void {
    this.pegarLinks()
  }

  pegarLinks(){
    this.linkBannerService.listarLinksEBanners().subscribe(response => {
      this.links = response;
    });
  }

  footerFixo: boolean = false;

  toggleFooter(): void {
    this.footerFixo = !this.footerFixo;
  }
}
