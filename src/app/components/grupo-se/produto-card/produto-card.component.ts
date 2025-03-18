import { Component, Input } from '@angular/core';
import { ImagemServiceService } from 'src/app/service/painel/imagem-service.service';
import * as dateFns from 'date-fns';

@Component({
  selector: 'app-produto-card',
  templateUrl: './produto-card.component.html',
  styleUrl: './produto-card.component.css'
})
export class ProdutoCardComponent {

  @Input() item: any;

  constructor(public imagemService: ImagemServiceService) {}

  calculateElapsedTime(createdDate: string): string {
      const currentDate = new Date();
      const differenceInSeconds = dateFns.differenceInSeconds(
        currentDate,
        new Date(createdDate)
      );
  
      const secondsInMinute = 60;
      const secondsInHour = secondsInMinute * 60;
      const secondsInDay = secondsInHour * 24;
      const secondsInMonth = secondsInDay * 30; // Aproximadamente 30 dias por mês
  
      if (differenceInSeconds < secondsInMinute) {
        return 'Agora';
      } else if (differenceInSeconds < secondsInHour) {
        const elapsedMinutes = Math.floor(differenceInSeconds / secondsInMinute);
        return `${elapsedMinutes} min atrás`;
      } else if (differenceInSeconds < secondsInDay) {
        const elapsedHours = Math.floor(differenceInSeconds / secondsInHour);
        return `${elapsedHours} horas atrás`;
      } else if (differenceInSeconds < secondsInMonth) {
        const elapsedDays = Math.floor(differenceInSeconds / secondsInDay);
        return `${elapsedDays} dias atrás`;
      } else {
        const elapsedMonths = Math.floor(differenceInSeconds / secondsInMonth);
        return `${elapsedMonths} meses atrás`;
      }
    }

  copiarParaAreaTransferencia(cupom: string): void {
    // Função para copiar o cupom para a área de transferência
    navigator.clipboard.writeText(cupom);
  }

  getSafeUrl(link: string): string {
    // Função para validar e retornar o link seguro
    return link;  // Retorne o link validado ou ajustado
  }
}
