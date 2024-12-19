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

  ofertasVsBotao: any;

  options: any;

  ofertasVsBotaoOptions: any;

  platformId = inject(PLATFORM_ID);

  analiseService = inject(AnaliseService)
  estatisticas: any = {};

  estSemana!: {
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
    Sunday: number;
  };

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
      console.log(this.estatisticas)
    })

    this.analiseService.obterPorcentagemCliquesNaoCliques().subscribe(data => {
      this.porcentagens = data;
    });

    this.analiseService.obterAcessosSemana().subscribe(data => {
      this.estSemana = data
      this.initChart();
    })
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.graficosDaSemana(documentStyle, textColor, textColorSecondary, surfaceBorder)

      this.porcentagemGraficos(documentStyle, textColor, textColorSecondary, surfaceBorder)

      this.acessosOfertasVsBotao(documentStyle, textColor, textColorSecondary, surfaceBorder)

      this.cd.markForCheck()
    }
  }

  acessosOfertasVsBotao(documentStyle: any, textColor: any, textColorSecondary: any, surfaceBorder: any){
    this.ofertasVsBotao = {
      labels: ['Página', 'Botão'],
      datasets: [
          {
              label: 'My First dataset',
              backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
              borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
              data: [this.estatisticas['totalAcessosOfertas'], this.estatisticas['totalCliquesBotao']]
          },
      ]
  };

  this.ofertasVsBotaoOptions = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
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
                  color: textColorSecondary,
                  font: {
                      weight: 500
                  }
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
  }

  porcentagemGraficos(documentStyle: any, textColor: any, textColorSecondary: any, surfaceBorder: any){
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
  }

  graficosDaSemana(documentStyle: any, textColor: any, textColorSecondary: any, surfaceBorder: any){
    this.data = {
      labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
      datasets: [
        {
          label: 'Semana',
          data: [this.estSemana?.Monday, this.estSemana?.Tuesday, this.estSemana?.Wednesday, this.estSemana?.Thursday,
             this.estSemana?.Friday, this.estSemana?.Saturday, this.estSemana?.Sunday],
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
  }

}
