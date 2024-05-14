import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReportsDto } from 'src/app/dto/ReportsResponseDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  listarReports(page: number, size: number){
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<ReportsPage>(`${this.apiUrl}/report/listar-reports`, { params });
  }

  apagarReport(id: number){
    return this.http.delete(`${this.apiUrl}/report/${id}`)
  }

  reportar(productId: number, reportType: string){
    const params = new HttpParams().set('productId', productId.toString()).set('reportType', reportType);
    return this.http.get(`${this.apiUrl}/report`, { params })
  }

  apagarVariosReports(reportsSelecionados: ReportsDto){
    return this.http.post<number>(`${this.apiUrl}/report/apagar-varios`, reportsSelecionados)
  }
}

interface ReportsPage{
  content: ReportsDto[],
  totalElements: number,
  totalPages: number
}
