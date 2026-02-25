import { Component } from '@angular/core';
import { LoginForm } from "../../components/login-form/login-form";
import { Botao } from "../../shared/botao-login/botao-login";
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-login',
  imports: [LoginForm, Botao],
  templateUrl: './pagina-login.html',
  styleUrl: './pagina-login.css',
})
export class PaginaLogin {

  constructor(private router: Router) { }

  entrar() { 
    this.router.navigate(['/dashboard']);
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }
}
