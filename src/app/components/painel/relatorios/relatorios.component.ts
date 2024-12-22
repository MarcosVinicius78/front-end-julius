import { AnaliseService } from './../../../service/painel/analise.service';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [ChartModule, FormsModule, CalendarModule],
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

  inicioSemana: string = "";
  fimSemana: string = "";
  rangeDates!: Date[];

  totalAcessoSistema: string = "";

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

  date: Date | undefined;

  acessoPagina: string = "";
  acessoBotao: string = "";

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.obterEstatisticas()
    this.buscarDadosPorDia()
    this.buscarDadosPorData()
  }

  obterEstatisticas() {
    this.analiseService.obterEstatisticas().subscribe(response => {
      this.totalAcessoSistema = response['totalAcessosSistema']
    })

    this.analiseService.obterPorcentagemCliquesNaoCliques().subscribe(data => {
      this.porcentagens = data;
      this.initChart()
    });

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

  buscarDadosPorDia() {
    const dataFormatada = this.date
      ? this.date.toISOString().split('T')[0]
      : this.formatarDataLocal(new Date());

    this.analiseService.buscarEventosPorDia(dataFormatada!).subscribe(response => {
      this.acessoPagina = response['ACESSO_OFERTAS']
      this.acessoBotao = response['CLIQUE_BOTAO']
      console.log(response)
    })
  }

  private formatarDataLocal(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês é zero-based
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  buscarDadosPorData() {

    const dataInicio = this.rangeDates?.[0]
      ? this.formatarDataLocalDateTime(this.rangeDates[0], true)
      : this.getInicioDaSemana();

    const dataFim = this.rangeDates?.[1]
      ? this.formatarDataLocalDateTime(this.rangeDates[1], false)
      : this.getFimDaSemana();

    this.analiseService.obterAcessosSemana(dataInicio, dataFim).subscribe(data => {
      this.estSemana = data
      this.initChart()
    })
  }

  // Formata a data para LocalDateTime (ISO 8601)
  private formatarDataLocalDateTime(data: Date, inicio: boolean): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês é zero-based
    const dia = String(data.getDate()).padStart(2, '0');
    const hora = inicio ? '00' : '23';
    const minuto = inicio ? '00' : '59';
    const segundo = inicio ? '00' : '59';
    return `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;
  }


  // Obter a data do início da semana (domingo como início)
  private getInicioDaSemana(): string {
    const hoje = new Date();
    const diaDaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda...
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - diaDaSemana); // Volta para o domingo
    return this.formatarDataLocalDateTime(inicioSemana, true);
  }

  // Obter a data do fim da semana (sábado como final)
  private getFimDaSemana(): string {
    const hoje = new Date();
    const diaDaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda...
    const fimSemana = new Date(hoje);
    fimSemana.setDate(hoje.getDate() + (6 - diaDaSemana)); // Vai até sábado
    return this.formatarDataLocalDateTime(fimSemana, false);
  }
  acessosOfertasVsBotao(documentStyle: any, textColor: any, textColorSecondary: any, surfaceBorder: any) {
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

  porcentagemGraficos(documentStyle: any, textColor: any, textColorSecondary: any, surfaceBorder: any) {
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

  graficosDaSemana(documentStyle: any, textColor: any, textColorSecondary: any, surfaceBorder: any) {
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
