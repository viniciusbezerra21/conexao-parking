import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { LoginResponse } from '../../models/loginResponse';
import { CadastroResponse } from '../../models/user';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private readonly API = environment.apiUrl;
  precisaTrocarSenha = signal<boolean>(false);
  private router = inject(Router)

  userRole = signal<string | null>(null);


  cadastrar(emailCorporativo: string) {
    return this.httpClient.post<CadastroResponse>(`${this.API}/usuario/cadastro`, {
      emailCorporativo
    });
  }

  login(emailCorporativo: string, senha: string) {
    return this.httpClient.post<LoginResponse>(`${this.API}/login`, {
      emailCorporativo,
      senha
    }).pipe(
      tap(response => {
        this.setToken(response.token);

        const decoded: any = jwtDecode(response.token);

        if (decoded.precisaTrocarSenha) {
          this.router.navigate(['/redefinir-senha']);
        }

      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.userRole.set(null);
  }

  checkEmailExistente(emailCorporativo: string) {
    return this.httpClient.get<boolean>(`${this.API}/usuario/check-email`, {
      params: { emailCorporativo }
    });
  }

  private setToken(token: string) {
    if (token) {
      localStorage.setItem('token', token);
      this.loadRole();
    }
  }

  constructor() {
    this.loadRole();
  }

  private loadRole() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.userRole.set(decoded.role);
        this.precisaTrocarSenha.set(decoded.precisaTrocarSenha ?? false)
      } catch (error) {
        this.userRole.set(null);
        this.precisaTrocarSenha.set(false);
      }
    } else {
      this.userRole.set(null);
      this.precisaTrocarSenha.set(false);
    }
  }

  isAdmin(): boolean {
    return this.userRole() === 'ROLE_ADMIN';
  }
}