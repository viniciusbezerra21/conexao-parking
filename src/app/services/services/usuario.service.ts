import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PageResponse } from '../../models/pageResponse';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface DadosListagemUsuario {
  idUsuario: number;
  emailCorporativo: string;
  ativo: boolean;
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
    // Note: The path below follows the controller's redundant structure (PUT /usuario/usuario/{id}/tornar-admin)
    return this.httpClient.put<void>(`${this.API}/usuario/${id}/tornar-admin`, {});
  }

  atualizar(id: number, dados: DadosAtualizacaoUsuario): Observable<DadosAtualizacaoUsuario> {
    return this.httpClient.put<DadosAtualizacaoUsuario>(`${this.API}/${id}`, dados);
  }
}
