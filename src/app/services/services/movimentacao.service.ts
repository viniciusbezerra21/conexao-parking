import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovimentacaoEntrada, MovimentacaoSaida, PaginaMovimentacao } from '../../models/movimentacao';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovimentacaoService {
  private httpClient = inject(HttpClient);

  
  private readonly API = `${environment.apiUrl}/movimentacao`;

  liberarEntrada(idVeiculo: number, observacao: string | null): Observable<MovimentacaoEntrada> {
    const payload = { idVeiculo, observacaoEntrada: observacao };
    return this.httpClient.post<MovimentacaoEntrada>(`${this.API}/liberar-entrada`, payload);
  }

  liberarSaida(idMovimentacao: number, observacao: string | null): Observable<MovimentacaoSaida> {
    const payload = { idMovimentacao, observacaoSaida: observacao };
    return this.httpClient.post<MovimentacaoSaida>(`${this.API}/liberar-saida`, payload);
  }

  listar(page: number = 0, size: number = 10): Observable<PaginaMovimentacao> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.httpClient.get<PaginaMovimentacao>(this.API, { params });
  }
}