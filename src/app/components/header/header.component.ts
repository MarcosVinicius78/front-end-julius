import { CategoriaService } from 'src/app/service/painel/categoria.service';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Categoria } from 'src/app/models/categoria';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  menuValue:boolean=false;
  menu_icon :string ='pi pi-bars';

  categorias: Categoria[] = [];

  constructor(
    private categoriaService: CategoriaService
  ) { }

  ngOnInit() {
    this.categoriaService.listarCategoria().subscribe(response => {
      this.categorias = response;
    });
  }

  toggleCategoria(): void {
      const dropdown = document.getElementById('categ');
      if (dropdown) {
        dropdown.classList.toggle('show');
      }
  }

  openMenu(){
    this.menuValue =! this.menuValue ;
    this.menu_icon = this.menuValue ? 'pi pi-times' : 'pi pi-bars';
  }
   closeMenu() {
    this.menuValue = false;
    this.menu_icon = 'bi bi-list';
  }

}
