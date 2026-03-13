import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageResponse } from '../../models/pageResponse';
import { Veiculo } from '../../models/veiculo';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VeiculoService {
  private API_URL = 'http://localhost:8080/veiculo';


  private veiculoAdicionadoSource = new Subject<void>();

  veiculoAdicionado$ = this.veiculoAdicionadoSource.asObservable();

  notificarNovoCadastro() {
    this.veiculoAdicionadoSource.next();
  }

  constructor(private httpClient: HttpClient) { }

  obterVeiculo(pagina: number, tamanho: number = 10): Observable<PageResponse<Veiculo>> {
    return this.httpClient.get<PageResponse<Veiculo>>(
      `${this.API_URL}?page=${pagina}&size=${tamanho}`
    );
  }

  obterTodosParaBusca(): Observable<PageResponse<Veiculo>> {
    return this.httpClient.get<PageResponse<Veiculo>>(`${this.API_URL}?page=0&size=500`);
  }

  detalhar(id: number): Observable<Veiculo> {
    return this.httpClient.get<Veiculo>(`${this.API_URL}/${id}`);
  }

  cadastrarVeiculo(veiculo: Veiculo): Observable<Veiculo> {
    return this.httpClient.post<Veiculo>(this.API_URL, veiculo);
  }
}