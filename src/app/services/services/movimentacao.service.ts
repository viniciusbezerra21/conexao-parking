import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovimentacaoService {
  private API_URL = 'http://localhost:8080/movimentacao';

  constructor(
    private httpClient: HttpClient
  ) { }
  
  liberarEntrada(dados: any): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/liberar-entrada`, dados);
  }

  liberarSaida(dados: any): Observable<any> {
    return this.httpClient.post<any>(`${this.API_URL}/liberar-saida`, dados);
  }

  listar(page: number = 0): Observable<any> {
    return this.httpClient.get(`${this.API_URL}?page=${page}&size=10`);
  }
}
