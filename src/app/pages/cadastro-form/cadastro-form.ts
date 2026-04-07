import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { LoginForm } from "../../components/login-form/login-form";
import { Botao } from "../../shared/botao-login/botao-login";
import { Router } from '@angular/router';
import { AuthService } from '../../services/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { catchError, map, of, tap } from 'rxjs';
import { LoadingSpinner } from "../../shared/loading-spinner/loading-spinner";
import { Toast, ToastType } from "../../shared/toast/toast";

@Component({
  selector: 'app-cadastro-form',
  standalone: true, 
  imports: [Botao, ReactiveFormsModule, LoginForm, LoadingSpinner, Toast],
  templateUrl: './cadastro-form.html',
  styleUrl: './cadastro-form.css',
})
export class CadastroForm implements OnInit {

  cadastroForm!: FormGroup;
  mensagemErro: string | null = null;
  carregando = false;

  readonly mostrarToast = signal(false);
  readonly mensagemToast = signal('');
  readonly tipoToast = signal<ToastType>('success');

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cadastroForm = this.fb.group({
      emailCorporativo: [
        '',
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.emailDisponivelValidator()],
          updateOn: 'blur'
        }
      ]
    });
  }

  emailDisponivelValidator() {
    return (control: AbstractControl) => {
      if (!control.value) return of(null);

      return this.authService.checkEmailExistente(control.value).pipe(
        map(isDisponivel => {
          return isDisponivel ? null : { emailEmUso: true };
        }),
        tap(() => this.cdr.markForCheck()),
        catchError(() => {
          this.cdr.markForCheck();
          return of(null);
        })
      );
    };
  }

  onSubmit() {
    if (this.cadastroForm.invalid) return;

    this.mensagemErro = null;
    this.carregando = true;

    const { emailCorporativo } = this.cadastroForm.value;

    this.authService.cadastrar(emailCorporativo!).subscribe({
      next: () => {
        this.mensagemToast.set('Convite enviado com sucesso! O usuário acessará com a senha provisória.');
        this.mostrarToast.set(true);
        this.tipoToast.set('success');
        this.carregando = false;
        this.cadastroForm.reset();
      },
      error: (error) => {
        this.carregando = false; 
       
        if (error.status === 409) {
          this.mensagemErro = 'Este e-mail já está sendo utilizado.';
        } else if (error.status === 403) {
          this.mensagemErro = 'Você não tem permissão para cadastrar/convidar usuários.';
        } else if (error.status === 401) {
          this.mensagemErro = 'Sua sessão expirou. Faça login novamente.';
        } else if (error.status === 400 && Array.isArray(error.error)) {
          this.mensagemErro = error.error[0].mensagem;
        } else {
          this.mensagemErro = 'Houve um erro no envio. Tente novamente mais tarde.';
        }

        this.mensagemToast.set(this.mensagemErro!);
        this.tipoToast.set('error');
        this.mostrarToast.set(true);

        this.cdr.markForCheck();
      }
    });
  }

  voltarAoDashboard() {
    this.router.navigate(['dashboard']);
  }
}