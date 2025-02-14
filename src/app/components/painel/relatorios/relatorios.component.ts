import { AnaliseService } from './../../../service/painel/analise.service';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { ProdutosComMaisCliques } from 'src/app/dto/ProdutoComMaisClique';
import { ImagemServiceService } from 'src/app/service/painel/imagem-service.service';
import { EventoQuantidadePorTipo } from 'src/app/dto/evento/EventoQuantidadePorTipo';
import { TotalDeAcessos } from 'src/app/dto/evento/TotalDeAcessos';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [ChartModule, FormsModule, CalendarModule, DatePipe, TableModule],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.scss'
})
export class RelatoriosComponent {

  basicData: any;

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

  produtos: ProdutosComMaisCliques[] = [];

  porcentagens!: { porcentagemCliques: number; porcentagemNaoCliques: number };

  date: Date | undefined;

  acessoPagina: string = "";
  acessoBotao: string = "";

  eventoQuantidadeLinkCurto: EventoQuantidadePorTipo = {}
  eventoQuantidadeAcessoAPagina: EventoQuantidadePorTipo = {}
  eventoQuantidadeCliquesNoBotao: EventoQuantidadePorTipo = {}
  eventoQuantidadeGeral: TotalDeAcessos = {}

  constructor(
    private cd: ChangeDetectorRef,
    public imagemService: ImagemServiceService
  ) { }

  ngOnInit() {

    this.obterEstatisticas()
    
    this.buscarDadosGeral()
    this.buscarDadosDaPagina()
    this.buscarDadosDoBotao()
    this.buscarDadosDoLinkCurto()

    this.buscarDadosPorData()
    this.listarProdutosComMaisCliques()
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

  listarProdutosComMaisCliques() {
    this.analiseService.listarProdutosComMaisCliques().subscribe({
      next: (res) => {
        this.produtos = res.content
      }
    })
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--blue-50');
      const textColorSecondary = documentStyle.getPropertyValue('--blue-50');
      const surfaceBorder = documentStyle.getPropertyValue('');

      this.graficosDaSemana(documentStyle, textColor, textColorSecondary, surfaceBorder)

      // this.acessosOfertasVsBotao(documentStyle, textColor, textColorSecondary, surfaceBorder)

      this.cd.markForCheck()
    }
  }

  buscarDadosDaPagina() {
    const dataFormatada = this.date
      ? this.date.toISOString().split('T')[0]
      : this.formatarDataLocal(new Date());

    this.analiseService.buscarEventosPorDia(dataFormatada!, "ACESSO_OFERTAS").subscribe({
      next: (res) => this.eventoQuantidadeAcessoAPagina = res
    })
  }

  buscarDadosDoBotao() {
    const dataFormatada = this.date
      ? this.date.toISOString().split('T')[0]
      : this.formatarDataLocal(new Date());

    this.analiseService.buscarEventosPorDia(dataFormatada!, "CLIQUE_BOTAO").subscribe({
      next: (res) => this.eventoQuantidadeCliquesNoBotao = res
    })
  }

  buscarDadosDoLinkCurto() {
    const dataFormatada = this.date
      ? this.date.toISOString().split('T')[0]
      : this.formatarDataLocal(new Date());

    this.analiseService.buscarEventosPorDia(dataFormatada!, "ACESSO_LINK_CURTO").subscribe({
      next: (res) => this.eventoQuantidadeLinkCurto= res
    })
  }

  buscarDadosGeral() {
    const dataFormatada = this.date
      ? this.date.toISOString().split('T')[0]
      : this.formatarDataLocal(new Date());

    this.analiseService.totalDeAcessosNoSitema().subscribe(response => {
      this.eventoQuantidadeGeral = response
    })
  }

  buscarDadosPorDia() {


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

  graficosDaSemana(documentStyle: any, textColor: any, textColorSecondary: any, surfaceBorder: any) {
    this.data = {
      labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
      datasets: [
        {
          label: 'Semana',
          data: [this.estSemana?.Monday, this.estSemana?.Tuesday, this.estSemana?.Wednesday, this.estSemana?.Thursday,
          this.estSemana?.Friday, this.estSemana?.Saturday, this.estSemana?.Sunday],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
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
