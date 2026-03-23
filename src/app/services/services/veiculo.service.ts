import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageResponse } from '../../models/pageResponse';
import { Veiculo } from '../../models/veiculo';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VeiculoService {
  private httpClient = inject(HttpClient);

  private readonly API = `${environment.apiUrl}/veiculo`;

  private veiculoAdicionadoSource = new Subject<void>();
  veiculoAdicionado$ = this.veiculoAdicionadoSource.asObservable();

  notificarNovoCadastro() {
    this.veiculoAdicionadoSource.next();
  }

  detalhar(id: number): Observable<Veiculo> {
    return this.httpClient.get<Veiculo>(`${this.API}/${id}`);
  }

  obterVeiculo(pagina: number, tamanho: number = 10): Observable<PageResponse<Veiculo>> {
    return this.httpClient.get<PageResponse<Veiculo>>(`${this.API}?page=${pagina}&size=${tamanho}`);
  }

  obterTodosParaBusca(): Observable<PageResponse<Veiculo>> {
    return this.httpClient.get<PageResponse<Veiculo>>(`${this.API}?page=0&size=500`);
  }

  cadastrarVeiculo(veiculo: Veiculo): Observable<Veiculo> {
    return this.httpClient.post<Veiculo>(this.API, veiculo);
  }

  deletarVeiculo(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.API}/${id}`);
  }

  editarVeiculo(veiculo: Veiculo): Observable<Veiculo> {
    return this.httpClient.put<Veiculo>(this.API, veiculo);
  }

  alternarBloqueio(id: number, bloquear: boolean): Observable<Veiculo> {
    const endpoint = bloquear ? 'bloquear' : 'desbloquear';
    return this.httpClient.patch<Veiculo>(`${this.API}/${id}/${endpoint}`, {}, { responseType: 'text' as 'json' });
  }
}