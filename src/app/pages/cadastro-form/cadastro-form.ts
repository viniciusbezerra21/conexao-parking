import { Component } from '@angular/core';
import { LoginForm } from "../../components/login-form/login-form";
import { Botao } from "../../shared/botao-login/botao-login";

@Component({
  selector: 'app-cadastro-form',
  imports: [LoginForm, Botao],
  templateUrl: './cadastro-form.html',
  styleUrl: './cadastro-form.css',
})
export class CadastroForm {

}
