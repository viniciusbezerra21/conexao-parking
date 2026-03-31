import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PageResponse } from '../../models/pageResponse';
import { environment } from '../../../environments/environment';

export interface DadosListagemUsuario {
  idUsuario: number;
  emailCorporativo: string;
  ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private httpClient = inject(HttpClient);
  private readonly API = environment.apiUrl;

  listar(page: number, size: number) {
    return this.httpClient.get<PageResponse<DadosListagemUsuario>>(`${this.API}/usuario`, {
      params: { 
        page: page.toString(),
        size: size.toString() 
      }
    });
  }
}
