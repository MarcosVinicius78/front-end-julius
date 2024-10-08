import { CategoriaService } from 'src/app/service/painel/categoria.service';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Categoria } from 'src/app/models/categoria';
import { isPlatformBrowser } from '@angular/common';
import { LinkBannerService } from 'src/app/service/painel/link-banner.service';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('categoria', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10%)' }),
        animate('300ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease', style({ opacity: 0, transform: 'translateY(0%)' }))
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {

  menuValue:boolean=false;
  abrirCategoria:boolean=false;
  menu_icon :string ='pi pi-bars';
  links = new LinksBanner();

  sidebarVisible: boolean = false;

  categorias: Categoria[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private linkBannerService: LinkBannerService
  ) { }

  ngOnInit() {
    this.categoriaService.listarCategoria().subscribe(response => {
      this.categorias = response;
      this.pegarLinks();
    });
  }

  toggleCategoria(): void {
      // const dropdown = document.getElementById('categ');
      // if (dropdown) {
      //   dropdown.classList.toggle('show');
      // }
    this.abrirCategoria =! this.abrirCategoria

  }

  openMenu(){
    this.menuValue =! this.menuValue ;
    console.log("aqui")
    this.menu_icon = this.menuValue ? 'pi pi-times' : 'pi pi-bars';
  }
   closeMenu() {
    this.menuValue = false;
    // this.menu_icon = 'bi bi-list';
  }

  pegarLinks() {
    this.linkBannerService.listarLinksEBanners().subscribe(response => {
      this.links = response;
    });
  }
}
