import { Component, OnInit } from '@angular/core';
import { ReportsDto } from 'src/app/dto/ReportsResponseDto';
import { ReportService } from 'src/app/service/painel/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  page = 0;
  size = 10;

  selectedProducts: number[] = [];
  selectAllCheckbox = false;

  totalPage!: number;

  reports: ReportsDto[] = [];

  constructor(private reportService: ReportService) {}

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
      this.listarReports();
    })
  }

  toggleReportSelection(productId: number) {
    if (this.selectedProducts.includes(productId)) {
      // Desmarcar um produto individual
      this.selectedProducts = this.selectedProducts.filter(id => id !== productId);
      // Desmarcar o checkbox "Selecionar Todos"
      this.selectAllCheckbox = false;
    } else {
      // Marcar um produto individual
      this.selectedProducts.push(productId);
    }
  }

  selectAll(event: any) {
    this.selectAllCheckbox = event.target.checked;
    console.log(this.selectAllCheckbox)

    if (this.selectAllCheckbox) {
      // Se o checkbox "Selecionar Todos" estiver marcado, marque todos os outros checkboxes
      this.selectedProducts = this.reports.map(product => product.id);
    } else {
      // Se o checkbox "Selecionar Todos" estiver desmarcado, desmarque todos os outros checkboxes
      this.selectedProducts = [];
    }
  }

  isAllSelected() {
    // Verifica se todos os produtos estão selecionados
    return this.selectedProducts.length === this.reports.length;
  }

  isSelected(productId: number): boolean {
    // Verificar se um produto está selecionado
    return this.selectedProducts.includes(productId);
  }

  apagarVariosReports(){
    console.log(this.selectedProducts)
    this.reportService.apagarVariosReports(this.selectedProducts).subscribe(response => {
      alert(`${response}: produtos apagados`);
      this.selectedProducts = [];
      this.reports = [];
      this.listarReports()
    });
  }

  changePage($event: any) {
  }

  dataCorreta(data: Date){
    const dataCerta = new Date(data);
    return dataCerta;
  }

}
