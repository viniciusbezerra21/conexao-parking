import { Component, OnInit } from '@angular/core';
import { LoginForm } from "../../components/login-form/login-form";
import { Botao } from "../../shared/botao-login/botao-login";
import { Router } from '@angular/router';
import { AuthService } from '../../services/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagina-login',
  imports: [LoginForm, Botao, ReactiveFormsModule],
  templateUrl: './pagina-login.html',
  styleUrl: './pagina-login.css',
})
export class PaginaLogin implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}
  
  loginForm!: FormGroup;


  ngOnInit() {
    this.loginForm = this.fb.group({
      emailCorporativo: [''],
      senha: ['']
    });
  }


  
  onSubmit() {
    if (this.loginForm.invalid) return;

    const { emailCorporativo, senha } = this.loginForm.value;


    this.authService.login(emailCorporativo!, senha!).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.log('Login falhou:', error);
      }
    })

  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }
}
