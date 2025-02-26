import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Produto } from 'src/app/models/produtos';
import { ListarProdutosCadastradosComponent } from '../../listar-produtos-cadastrados.component';
import { ProdutoService } from 'src/app/service/painel/produto.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-menuOpcoes',
  templateUrl: './menuOpcoes.component.html',
  styleUrls: ['./menuOpcoes.component.css'],
  animations: [
    trigger('menuState', [
      state('closed', style({
        opacity: 0,
        transform: 'scale(0.8)'
      })),
      state('open', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('closed => open', [
        animate('200ms ease-out')
      ]),
      transition('open => closed', [
        animate('200ms ease-in')
      ])
    ])
  ],
  providers: [MessageService]
})
export class MenuOpcoesComponent implements OnInit {

  @Input() product!: Produto;
  @Input() menuOpen: boolean = false;
  @Output() toggleMenu = new EventEmitter<void>();
  @ViewChild('menu') menuElement!: ElementRef;

  constructor(
    private produto: ListarProdutosCadastradosComponent,
    private el: ElementRef,
    private renderer: Renderer2,
    private produtoService: ProdutoService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
  }

  adjustMenuPosition() {

    const menuRect = this.menuElement.nativeElement.getBoundingClientRect();
    const tableRect = this.el.nativeElement.closest('table').getBoundingClientRect();

    if (menuRect.bottom > tableRect.bottom) {
      this.renderer.setStyle(this.menuElement.nativeElement, 'bottom', '25px');
      this.renderer.setStyle(this.menuElement.nativeElement, 'top', 'auto');
    } else {
      this.renderer.setStyle(this.menuElement.nativeElement, 'top', '100%');
      this.renderer.setStyle(this.menuElement.nativeElement, 'bottom', 'auto');
    }
  }

  onToggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      setTimeout(() => this.adjustMenuPosition(), 0);
    }
    this.toggleMenu.emit();

  }

  apagarProduto(id: number, urlImagem: string, imagemSocial: string){
    this.produto.apagarProduto(id, urlImagem, imagemSocial);
  }

  encerrarPromocao(status: boolean, id: number){
    this.produtoService.encerrarPromocao(status, id).subscribe(response => {
      if (status) {
        this.messageService.add({ severity: 'success', detail: 'Promoção Encerrada' });
        this.product.promocaoEncerrada = status
      }else{
        this.messageService.add({ severity: 'success', detail: 'Promoção Ativada' });
        this.product.promocaoEncerrada = status
      }
      this.onToggleMenu()
    }, err => {
      this.messageService.add({ severity: 'error', detail: 'Erro ao Ativar/Encerrar Promoção' });
    })
  }

}
