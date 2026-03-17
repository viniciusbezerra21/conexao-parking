import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageResponse } from '../../models/pageResponse';
import { Veiculo } from '../../models/veiculo';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VeiculoService {
  private readonly API_URL = 'http://localhost:8080/veiculo';

  private veiculoAdicionadoSource = new Subject<void>();
  veiculoAdicionado$ = this.veiculoAdicionadoSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  notificarNovoCadastro() {
    this.veiculoAdicionadoSource.next();
  }

  detalhar(id: number): Observable<Veiculo> {
    return this.httpClient.get<Veiculo>(`${this.API_URL}/${id}`);
  }

  obterVeiculo(pagina: number, tamanho: number = 10): Observable<PageResponse<Veiculo>> {
    return this.httpClient.get<PageResponse<Veiculo>>(`${this.API_URL}?page=${pagina}&size=${tamanho}`);
  }

  obterTodosParaBusca(): Observable<PageResponse<Veiculo>> {
    return this.httpClient.get<PageResponse<Veiculo>>(`${this.API_URL}?page=0&size=500`);
  }

  cadastrarVeiculo(veiculo: Veiculo): Observable<Veiculo> {
    return this.httpClient.post<Veiculo>(this.API_URL, veiculo);
  }

  deletarVeiculo(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.API_URL}/${id}`);
  }

  editarVeiculo(veiculo: Veiculo): Observable<Veiculo> {
    return this.httpClient.put<Veiculo>(this.API_URL, veiculo);
  }

  alternarBloqueio(id: number, bloquear: boolean): Observable<Veiculo> {
    const endpoint = bloquear ? 'bloquear' : 'desbloquear';
    return this.httpClient.patch<Veiculo>(`${this.API_URL}/${id}/${endpoint}`, {}, { responseType: 'text' as 'json' });
  }
}