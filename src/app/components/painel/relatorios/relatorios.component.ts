import { AnaliseService } from './../../../service/painel/analise.service';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, PLATFORM_ID } from '@angular/core';
import { response } from 'express';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.css'
})
export class RelatoriosComponent {

  basicData: any;
  procentagemData: any;

  basicOptions: any;

  data: any;

  options: any;

  platformId = inject(PLATFORM_ID);

  analiseService = inject(AnaliseService)
  estatisticas: any = {};

  porcentagens!: { porcentagemCliques: number; porcentagemNaoCliques: number };

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.obterEstatisticas()
  }

  obterEstatisticas(){
    this.analiseService.obterEstatisticas().subscribe(response => {
      this.estatisticas = response
    })

    this.analiseService.obterPorcentagemCliquesNaoCliques().subscribe(data => {
      this.porcentagens = data;
      this.initChart();
    });

  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.procentagemData = {
        labels: ['Cliques', 'Não Cliques'],
        datasets: [
          {
            label: 'Cliques no Botão Pegar Promoção',
            data: [this.porcentagens?.porcentagemNaoCliques, this.porcentagens?.porcentagemCliques],
            backgroundColor: [
              'rgba(249, 115, 22, 0.2)',
              'rgba(6, 182, 212, 0.2)',
            ],
            borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)'],
            borderWidth: 1,
          },
        ],
      }

      this.basicOptions = {
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      };

      this.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
            tension: 0.4
          },
          {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-gray-500'),
            tension: 0.4
          }
        ]
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          }
        }
      };

      this.cd.markForCheck()
    }
  }

}
