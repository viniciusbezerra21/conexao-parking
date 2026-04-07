import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PageResponse } from '../../models/pageResponse';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface DadosListagemUsuario {
  idUsuario: number;
  emailCorporativo: string;
  ativo: boolean;
  precisaTrocarSenha?: boolean;
  role?: string;
}

export interface DadosAtualizacaoUsuario {
  idUsuario: number;
  emailCorporativo: string;
  novaSenha?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private httpClient = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/usuario`;

  listar(page: number, size: number) {
    return this.httpClient.get<PageResponse<DadosListagemUsuario>>(this.API, {
      params: { 
        page: page.toString(),
        size: size.toString() 
      }
    });
  }

  excluir(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.API}/${id}`);
  }

  tornarAdmin(id: number): Observable<void> {
    return this.httpClient.put<void>(`${this.API}/${id}/tornar-admin`, {});
  }

  tornarUsuario(id: number): Observable<void> {
    return this.httpClient.put<void>(`${this.API}/${id}/tornar-usuario`, {});
  }

  resetarSenha(id: number): Observable<void> {
    return this.httpClient.put<void>(`${this.API}/${id}/resetar-senha`, {});
  }

  atualizar(id: number, dados: any): Observable<any> {
    return this.httpClient.put<any>(`${this.API}/${id}`, dados);
  }
}
