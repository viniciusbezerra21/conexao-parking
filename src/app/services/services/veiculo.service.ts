import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageResponse } from '../../models/pageResponse';
import { Veiculo } from '../../models/veiculo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VeiculoService {

  private API_URL = 'http://localhost:8080/veiculo';

  constructor(private httpClient: HttpClient) { }

  obterVeiculo(page = 0, size = 10): Observable<PageResponse<Veiculo>> {
    return this.httpClient.get<PageResponse<Veiculo>>(
      `${this.API_URL}?page=${page}&size=${size}`
    );
  }

  cadastrarVeiculo(veiculo: Veiculo): Observable<Veiculo> {
    return this.httpClient.post<Veiculo>(this.API_URL, veiculo);
  }
}