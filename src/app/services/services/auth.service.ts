import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginResponse } from '../../models/loginResponse';
import { CadastroResponse } from '../../models/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);

  private readonly API = environment.apiUrl;

  cadastrar(emailCorporativo: string, senha: string) {
    return this.httpClient.post<CadastroResponse>(`${this.API}/usuario/cadastro`, {
      emailCorporativo,
      senha
    }).pipe(
      tap(response => {
        this.setToken(response.token);
      })
    );
  }

  login(emailCorporativo: string, senha: string) {
    return this.httpClient.post<LoginResponse>(`${this.API}/login`, {
      emailCorporativo,
      senha
    }).pipe(
      tap(response => {
        this.setToken(response.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  checkEmailExistente(emailCorporativo: string) {
    return this.httpClient.get<boolean>(`${this.API}/usuario/check-email`, {
      params: { emailCorporativo }
    });
  }

  // Método auxiliar para evitar repetição de código
  private setToken(token: string) {
    if (token) {
      localStorage.setItem('token', token);
    }
  }
}