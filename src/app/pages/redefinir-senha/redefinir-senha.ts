import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginForm } from '../../components/login-form/login-form';
import { Botao } from '../../shared/botao-login/botao-login';
import { AuthService } from '../../services/services/auth.service';
import { UsuarioService } from '../../services/services/usuario.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-redefinir-senha',
  imports: [ReactiveFormsModule, LoginForm, Botao],
  templateUrl: './redefinir-senha.html',
  styleUrl: './redefinir-senha.css',
})
export class RedefinirSenha {
  redefinirForm: FormGroup;
  mostrarNovaSenha = false;
  mostrarConfirmarSenha = false;
  carregando = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  constructor() {
    this.redefinirForm = this.fb.group({
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validators: this.senhasIguaisValidator });
  }

  senhasIguaisValidator(control: AbstractControl): ValidationErrors | null {
    const novaSenha = control.get('novaSenha')?.value;
    const confirmarSenha = control.get('confirmarSenha')?.value;
    return novaSenha === confirmarSenha ? null : { senhasDiferentes: true };
  }

  onSubmit() {
    if (this.redefinirForm.invalid) return;

    this.carregando = true;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const decoded: any = jwtDecode(token);
      const idUsuario = decoded.id; 
      const emailCorporativo = decoded.sub;

      if (!idUsuario) throw new Error('ID do usuário não encontrado no token');

      this.usuarioService.atualizar(idUsuario, {
        idUsuario: idUsuario,
        emailCorporativo: emailCorporativo,
        novaSenha: this.redefinirForm.value.novaSenha
      }).subscribe({
        next: (res) => {
          this.carregando = false;
          if (res && res.precisaTrocarSenha === false) {
            this.redefinirForm.reset();
            alert('Senha redefinida com sucesso! Por favor, faça login com a nova senha.');
            this.authService.logout();
            this.router.navigate(['/login']);
          } else if (res && res.precisaTrocarSenha === true) {
            alert('Erro: a senha foi enviada, mas a flag precisaTrocarSenha não foi alterada.');
          } else {
            // Se o backend não retornou o objeto atualizado, assumimos sucesso, mas o ideal é retornar o objeto
            this.redefinirForm.reset();
            alert('Senha redefinida com sucesso!');
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          this.carregando = false;
          console.error(err);
          alert('Erro ao redefinir a senha.');
        }
      });
    } catch (e) {
      this.carregando = false;
      console.error(e);
      alert('Erro ao processar as credenciais. Por favor, tente novamente.');
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
