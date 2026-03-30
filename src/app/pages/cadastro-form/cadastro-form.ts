import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { LoginForm } from "../../components/login-form/login-form";
import { Botao } from "../../shared/botao-login/botao-login";
import { Router } from '@angular/router';
import { AuthService } from '../../services/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  mostrarSenha = false;
  mostrarRepeteSenha = false;
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
      ],
      senha: ['', [Validators.required, this.senhaComplexaValidator]],
      repeteSenha: ['', [Validators.required]]
    }, {
      validators: this.senhasIguaisValidator
    });
  }

  senhaComplexaValidator(control: AbstractControl): ValidationErrors | null {
    const valor = control.value || '';

    const temMaiuscula = /[A-Z]/.test(valor);
    const temNumero = /[0-9]/.test(valor);
    const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(valor);
    const tamanhoValido = valor.length >= 8;

    const senhaValida = temMaiuscula && temNumero && temEspecial && tamanhoValido;

    
    return senhaValida ? null : { senhaFraca: true };
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


  senhasIguaisValidator(group: AbstractControl): ValidationErrors | null {
    const senha = group.get('senha')?.value;
    const repeteSenha = group.get('repeteSenha')?.value;
    return senha === repeteSenha ? null : { senhasDiferentes: true };
  }

  onSubmit() {
    if (this.cadastroForm.invalid) return;

    this.mensagemErro = null;
    this.carregando = true;

    const { emailCorporativo, senha } = this.cadastroForm.value;

    this.authService.cadastrar(emailCorporativo!, senha!).subscribe({
      next: () => {
        this.mensagemToast.set('Cadastro realizado com sucesso!');
        this.mostrarToast.set(true);
        this.tipoToast.set('success');
        this.carregando = false;
        
      },
      error: (error) => {
        this.carregando = false; 

       
        if (error.status === 409) {
          this.mensagemErro = 'Este e-mail já está sendo utilizado.';
        } else if (error.status === 400 && Array.isArray(error.error)) {

          this.mensagemErro = error.error[0].mensagem;
        } else {
          this.mensagemErro = 'Houve um erro no cadastro. Tente novamente.';
        }

        this.mensagemToast.set(this.mensagemErro!);
        this.tipoToast.set('error');
        this.mostrarToast.set(true);

        this.cdr.markForCheck();
      },
      complete: () => {
        this.carregando = false; 
      }
    });
  }

  voltarAoDashboard() {
    this.router.navigate(['dashboard']);
  }
}