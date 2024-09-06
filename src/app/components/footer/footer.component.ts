import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { AtivarRodapéService } from 'src/app/service/ativarRodapé.service';
import { LinkBannerService } from 'src/app/service/painel/link-banner.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit{

  footerFixo: boolean = false;
  links = new LinksBanner();
  rodapeAtivo: boolean = false;
  rodapeGeral: boolean = false;

  constructor(
    private linkBannerService: LinkBannerService,
    private ativarRodape: AtivarRodapéService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.pegarLinks()

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/') {
        this.ativarRodape.rodapeAtivo$.subscribe((ativo) => {
          this.rodapeAtivo = ativo;
          console.log(event.url);
        });
      } else {
        this.rodapeGeral = true;
      }
    });
  }

  pegarLinks(){
    this.linkBannerService.listarLinksEBanners().subscribe(response => {
      this.links = response;
    });
  }


  toggleFooter(): void {
    this.footerFixo = !this.footerFixo;
  }

  fecharFooter(){
    this.ativarRodape.ativarRodape(false);
  }
}
