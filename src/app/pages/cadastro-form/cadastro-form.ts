import { Component } from '@angular/core';
import { LoginForm } from "../../components/login-form/login-form";
import { Botao } from "../../shared/botao-login/botao-login";
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-form',
  imports: [LoginForm, Botao],
  templateUrl: './cadastro-form.html',
  styleUrl: './cadastro-form.css',
})
export class CadastroForm {
  constructor(private router: Router) { }

  entrar() {
    this.router.navigate(['/dashboard']);
  }
}
