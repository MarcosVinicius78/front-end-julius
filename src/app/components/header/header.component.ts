import { CategoriaService } from 'src/app/service/painel/categoria.service';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Categoria } from 'src/app/models/categoria';
import { isPlatformBrowser } from '@angular/common';
import { LinkBannerService } from 'src/app/service/painel/link-banner.service';
import { LinksBanner } from 'src/app/dto/LinksBanner';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { SearchStorageService } from 'src/app/service/search-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('categoria', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10%)' }),
        animate('300ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease', style({ opacity: 0, transform: 'translateY(0%)' }))
      ])
    ]),
    trigger('pesquisa', [
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

  menuValue: boolean = false;
  abrirCategoria: boolean = false;
  menu_icon: string = 'pi pi-bars';
  links = new LinksBanner();

  sidebarVisible: boolean = false;

  categorias: Categoria[] = [];

  modalPesquisa: boolean = false;

  termoPesquisa: string = "";

  pesquisasRecentes: string[] = [];

  constructor(
    private categoriaService: CategoriaService,
    private linkBannerService: LinkBannerService,
    private router: Router,
    private pesquisaRecenteService: SearchStorageService
  ) { }

  ngOnInit() {
    this.categoriaService.listarCategoria().subscribe(response => {
      this.categorias = response.content;
      this.pegarLinks();
    });

    console.log(this.menuValue)

    this.carregarPesquisasRecentes();
  }

  toggleCategoria(): void {
    // const dropdown = document.getElementById('categ');
    // if (dropdown) {
    //   dropdown.classList.toggle('show');
    // }
    this.abrirCategoria = !this.abrirCategoria

  }

  openMenu() {
    this.menuValue = !this.menuValue;
    this.menu_icon = this.menuValue ? 'pi pi-times' : 'pi pi-bars';
  }
  closeMenu() {
    this.menuValue = false;
  }

  pegarLinks() {
    this.linkBannerService.listarLinksEBanners().then(response => {
      this.links = response;
    });
  }

  abrirModalPesquisa() {
    this.modalPesquisa = !this.modalPesquisa
  }

  pesquisar() {

    if (this.termoPesquisa.trim() !== '') {
      this.pesquisaRecenteService.adicionarPesquisa(this.termoPesquisa);
      this.pesquisasRecentes = this.pesquisaRecenteService.pegarPesquisaRecente();
    }


    this.router.navigate(["/pesquisa"], { queryParams: { search: this.termoPesquisa } }).then(() => {
      window.location.reload();  // Recarrega a página após a navegação
    });
    this.modalPesquisa = false
  }

  carregarPesquisasRecentes() {
    this.pesquisasRecentes = this.pesquisaRecenteService.pegarPesquisaRecente();

    console.log(this.pesquisasRecentes)
  }
}
