import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoginForm } from "../../components/login-form/login-form";
import { Botao } from "../../shared/botao-login/botao-login";
import { Router } from '@angular/router';
import { AuthService } from '../../services/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, map, of, tap } from 'rxjs';
import { LoadingSpinner } from "../../shared/loading-spinner/loading-spinner";

@Component({
  selector: 'app-pagina-login',
  imports: [LoginForm, Botao, ReactiveFormsModule, LoadingSpinner],
  templateUrl: './pagina-login.html',
  styleUrl: './pagina-login.css',
})
export class PaginaLogin implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}
  
  loginForm!: FormGroup;
  mostrarSenha: boolean = false;
  mensagemErro: string | null = null;
  carregando: boolean = false;

  ngOnInit() {
    this.loginForm = this.fb.group({
      emailCorporativo: [
        '',
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.emailExistenteValidator()], 
          updateOn: 'blur'
        }
      ],
      senha: ['', [Validators.required]]
    });

  }

  emailExistenteValidator() {
    return (control: any) => {
      if (!control.value) return of(null);

      return this.authService.checkEmailExistente(control.value).pipe(
        map(isDisponivel => {
          return isDisponivel ? { usuarioNaoEncontrado: true } : null;
        }),
        tap(() => this.cdr.markForCheck()),
        catchError((err) => {
          this.cdr.markForCheck();
          return of(null);
        })
      );
    };
  }


  
  onSubmit() {
    if (this.loginForm.invalid) return;

    this.mensagemErro = null;
    this.carregando = true;

    const { emailCorporativo, senha } = this.loginForm.value;

    this.authService.login(emailCorporativo!, senha!).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.carregando = false;

        if (error.status === 404) {
          this.mensagemErro = 'Este e-mail não consta em nossa base de dados.';
        } else if (error.status === 403 || error.status === 401) {
          this.mensagemErro = 'E-mail ou senha incorretos.';
        } else {
          this.mensagemErro = 'Erro ao conectar com o servidor. Tente mais tarde.';
        }

        this.cdr.markForCheck();
      }
    });
  }

  irParaCadastro() {
    this.router.navigate(['/cadastro']);
  }
}
