import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { MovimentacaoEntrada, MovimentacaoSaida } from '../../models/movimentacao';

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

  listar(page: number = 0): Observable<any> {
    return this.httpClient.get(`${this.API_URL}?page=${page}&size=10`);
  }
}
