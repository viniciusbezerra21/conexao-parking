import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { MovimentacaoEntrada, MovimentacaoSaida, PaginaMovimentacao } from '../../models/movimentacao';

@Injectable({
  providedIn: 'root',
})
export class MovimentacaoService {
  private API_URL = 'http://localhost:8080/movimentacao';

  constructor(
    private httpClient: HttpClient
  ) { }
  
  liberarEntrada( idVeiculo: number, observacao: string | null): Observable<MovimentacaoEntrada> {
    const payload = { idVeiculo, observacaoEntrada: observacao };
    return this.httpClient.post<MovimentacaoEntrada>(`${this.API_URL}/liberar-entrada`, payload);
  }

  liberarSaida( idMovimentacao: number, observacao: string | null): Observable<MovimentacaoSaida> {
    const payload = { idMovimentacao, observacaoSaida: observacao };
    return this.httpClient.post<MovimentacaoSaida>(`${this.API_URL}/liberar-saida`, payload);
  }

  listar(page: number = 0, size: number = 10): Observable<PaginaMovimentacao> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.httpClient.get<PaginaMovimentacao>(`${this.API_URL}`, { params });
  }
}
