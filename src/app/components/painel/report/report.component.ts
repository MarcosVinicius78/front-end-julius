import { Component, OnInit } from '@angular/core';
import { ReportsDto } from 'src/app/dto/ReportsResponseDto';
import { ReportService } from 'src/app/service/painel/report.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [MessageService]
})
export class ReportComponent implements OnInit {

  page = 0;
  size = 10;

  text: string = 'Hello World!';

  selectedProducts: number[] = [];
  selectAllCheckbox = false;

  totalPage!: number;

  reports: ReportsDto[] = [];

  reportSelecionado!: ReportsDto;

  constructor(
    private reportService: ReportService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listarReports();
  }

  listarReports() {
    this.reportService.listarReports(this.page, this.size).subscribe(reponse => {
      this.reports = reponse.content;
      this.totalPage = reponse.totalPages;
    })
  }

  apagarProduto(id: number) {
    this.reportService.apagarReport(id).subscribe(response => {
      this.messageService.add({ severity: 'success', detail: 'Report Apagado' });
      this.listarReports();
    }, err => {
      console.log(err)
      this.messageService.add({ severity: 'error', detail: 'Erro ao Apagar Report' });
    });
  }

  apagarVariosReports(){
    console.log(this.reportSelecionado)
    this.reportService.apagarVariosReports(this.reportSelecionado).subscribe(response => {
      this.messageService.add({ severity: 'success', detail: 'Reports Apagados' });
      this.selectedProducts = [];
      this.reports = [];
      this.listarReports()
    }, err => {
      this.messageService.add({ severity: 'error', detail: 'Erro ao Apagar' });
    });
  }

  changePage(page: any) {
    this.page = page.page
    this.reportService.listarReports(this.page, this.size).subscribe( (response: any) => {
      this.reports = response.content
    });
  }
}
