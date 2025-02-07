import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrl: './image-display.component.css'
})
export class ImageDisplayComponent implements OnInit {
  @Input() externalUrl: string = ''; // URL de fora (scraperProduto.urlImagem)
  @Input() serverUrl: string = '';   // URL do servidor (imagem armazenada no backend)
  @Input() localImage: string = '';  // Imagem local (selecionada pelo usuário)

  @Output() imageSelected = new EventEmitter<File>(); // Emite o arquivo selecionado

  uniqueId: string = '';

  ngOnInit() {
    // Cria um ID único para evitar conflitos de labels
    this.uniqueId = Math.random().toString(36).substring(2, 10);
  }

  // Método para capturar a imagem selecionada e emitir para o componente pai
  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.externalUrl = '';
    this.serverUrl = '';
    if (file) {
      this.imageSelected.emit(file);
    }
  }
}
