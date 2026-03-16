import { Component, OnInit } from '@angular/core';
import { LoginForm } from "../../components/login-form/login-form";
import { Botao } from "../../shared/botao-login/botao-login";
import { Router } from '@angular/router';
import { AuthService } from '../../services/services/auth.service';
import {  FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-cadastro-form',
  imports: [Botao, ReactiveFormsModule, LoginForm],
  templateUrl: './cadastro-form.html',
  styleUrl: './cadastro-form.css',
})
export class CadastroForm implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) { }
  
  mostrarSenha: boolean = false;
  mostrarRepeteSenha: boolean = false;
  cadastroForm!: FormGroup;

  ngOnInit() {
    this.cadastroForm = this.fb.group({
      emailCorporativo: [''],
      senha: [''],
      repeteSenha: ['']
    })
  }

  onSubmit() {
    if (this.cadastroForm.invalid) return;

    const { emailCorporativo, senha } = this.cadastroForm.value;

    this.authService.cadastrar(emailCorporativo!, senha!).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.log('Cadastro falhou:', error);
      }
    })
    
  }
}
