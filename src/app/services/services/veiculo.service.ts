import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageResponse } from '../../models/pageResponse';
import { Veiculo } from '../../models/veiculo';
import { CadastrarVeiculo } from '../../pages/cadastrar-veiculo/cadastrar-veiculo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VeiculoService {
  private API_URL = 'http://localhost:8080/veiculo';

  private token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUEkgQ29uZXhhbyBQYXJraW5nIiwic3ViIjoidmluaUBhZG0uY29tIiwiaWQiOjEsInJvbGUiOiJST0xFX0FETUlOIiwiZXhwIjoxNzcyNjMwMzU3fQ.RQnCAIwr9MPVOFMxYiyTgdK3nYgZFLS2PLOS8pvrCMg";

  private headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  });

  constructor(private httpClient: HttpClient) { }

  obterVeiculo(page = 0, size = 10) {
    return this.httpClient.get<PageResponse<Veiculo>>(
      `${this.API_URL}?page=${page}&size=${size}`,
      { headers: this.headers }
    );
  }

  cadastrarVeiculo(veiculo: Veiculo): Observable<Veiculo> {
    return this.httpClient.post<Veiculo>(this.API_URL, veiculo);
  }  
}