import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, ElementRef, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss']
})
export class MenuLateralComponent {

  menuAtivado: boolean = false;

  menuCadastrar: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private route: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ativarMenu() {
    this.menuAtivado = !this.menuAtivado;
  }

  isOpen = false;
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  ativarMenuCadastrar() {
    this.menuCadastrar = !this.menuCadastrar;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.menuAtivado = false;
    }
  }

  sair() {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.removeItem("userdetails");
      window.sessionStorage.removeItem("Authorization");
      window.sessionStorage.removeItem("XSRF-TOKEN");
    }
    this.route.navigate(["login"])
  }
}
