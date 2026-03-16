import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginResponse } from '../../models/loginResponse';
import { CadastroResponse } from '../../models/user';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  
  cadastrar(emailCorporativo: string, senha: string) {
    return this.httpClient.post<CadastroResponse>('http://localhost:8080/usuario/cadastro', {
      emailCorporativo,
      senha
    }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );

  }

  login(emailCorporativo: string, senha: string) {
    return this.httpClient.post<LoginResponse>('http://localhost:8080/login', {
      emailCorporativo,
      senha
    }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
  } 
}
