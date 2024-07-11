import { Component, HostListener,ElementRef } from '@angular/core';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss']
})
export class MenuLateralComponent {

  menuAtivado: boolean = false;

  constructor(private elementRef: ElementRef) { }

  ativarMenu() {
    this.menuAtivado =! this.menuAtivado;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.menuAtivado = false;
    }
  }
}
