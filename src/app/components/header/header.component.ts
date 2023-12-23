import { CategoriaService } from 'src/app/service/painel/categoria.service';
import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/models/categoria';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  categorias: Categoria[] = [];

  constructor(private categoriaService: CategoriaService) { }

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

}
