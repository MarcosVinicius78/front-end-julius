import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { AtivarRodapéService } from 'src/app/service/ativarRodapé.service';
import { LinkBannerService } from 'src/app/service/painel/link-banner.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10%)' }),
        animate('300ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0, transform: 'translateY(10%)' }))
      ])
    ])
  ]
})
export class FooterComponent implements OnInit{

  footerFixo: boolean = false;
  links = new LinksBanner();
  rodapeAtivo: boolean = false;
  rodapeGeral: boolean = false;
  rodapeMobile: boolean = false;

  paginaInicial: boolean = false;

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
          this.paginaInicial = false
          this.ativarRodape.rodapeAtivo$.subscribe((ativo) => {
            this.paginaInicial = ativo;
          });
        }else if(event.url === '/grupos'){
          this.paginaInicial = false;
        }else{
          this.paginaInicial = true;
          this.rodapeGeral = true

        }

        console.log(this.paginaInicial)
      })

    // this.router.events.pipe(
    //   filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    // ).subscribe((event: NavigationEnd) => {
    //   if (event.url === '/') {
    //     this.rodapeMobile = true;
    //     this.rodapeGeral = false;

    //     this.ativarRodape.ativarRodape(false); // Define que o rodapé não está ativo

    //     this.ativarRodape.rodapeAtivo$.subscribe((ativo) => {
    //       this.rodapeAtivo = ativo;
    //     });
    //   } else if (event.url.includes('oferta')) {
    //     this.rodapeMobile = false;
    //     this.rodapeGeral = true;
    //     this.rodapeAtivo = false; // Desativa o rodapé para outras páginas
    //   }
    // });

  }

  pegarLinks(){
    this.linkBannerService.listarLinksEBanners().then(response => {
      this.links = response;
    });
  }


  abrirFooter() {
    this.rodapeAtivo = true;
    this.rodapeGeral = false;
    this.paginaInicial = true;
    console.log(this.paginaInicial)
  }

  fecharFooter() {
    this.paginaInicial = false;
  }
}
