import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { VeiculoService } from '../../services/services/veiculo.service';
import { StatusVeiculo, TipoVeiculo } from '../../models/veiculo';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { Toast, ToastType } from "../../shared/toast/toast";
import { CpfValidator } from '../../shared/validators/cpf.validator';

@Component({
  selector: 'app-cadastrar-veiculo',
  imports: [ReactiveFormsModule, NgxMaskDirective, Toast],
  templateUrl: './cadastrar-veiculo.html',
  styleUrl: './cadastrar-veiculo.css',
})
export class CadastrarVeiculo {
  private fb = inject(FormBuilder);
  private veiculoService = inject(VeiculoService);
  private router = inject(Router);
  readonly isLoading = signal(false);

  tiposDeVeiculo = Object.values(TipoVeiculo);

  readonly mostrarToast = signal(false);
  readonly mensagemToast = signal('');
  readonly tipoToast = signal<ToastType>('success');

  veiculoForm = this.fb.group({
    numeroPlaca: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{3}-[0-9][a-zA-Z0-9][0-9]{2}$/)]],
    cor: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
    visitante: [false],
    tipoVeiculo: [null as TipoVeiculo | null, [Validators.required]],
    statusVeiculo: [StatusVeiculo.ATIVO, [Validators.required]],
    proprietario: this.fb.group({
      nome: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]+$/)]],
      cpfProprietario: ['', [Validators.required, CpfValidator.validar]]
    }),
    empresa: ['']
  });



  private resetForm() {
    this.veiculoForm.reset({
      numeroPlaca: '',
      cor: '',
      visitante: false,
      tipoVeiculo: null,
      statusVeiculo: StatusVeiculo.ATIVO,
      proprietario: {
        nome: '',
        cpfProprietario: '',
      },
      empresa: ''
    });
    this.router.navigate(['/dashboard']);
  }

  constructor() {
    this.veiculoForm.get('tipoVeiculo')?.valueChanges.subscribe(tipo => {
      const empresaControl = this.veiculoForm.get('empresa');

      if (tipo === TipoVeiculo.CAMINHAO) {
        empresaControl?.setValidators([Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s.,&'-]+$/)]);
      } else {
        empresaControl?.clearValidators();
        empresaControl?.setValue('');
      }
      empresaControl?.updateValueAndValidity();
    });
  }

  get exibirCampoEmpresa(): boolean {
    return this.veiculoForm.get('tipoVeiculo')?.value === TipoVeiculo.CAMINHAO;
  }

  onSubmit() {
    this.isLoading.set(true);
    if (this.veiculoForm.valid) {
      const dados = { ...this.veiculoForm.value } as any;

      if (dados.numeroPlaca) {
        dados.numeroPlaca = dados.numeroPlaca.toUpperCase();
      }

      if (dados.statusVeiculo === StatusVeiculo.ATIVO) {
        dados.status = 'ATIVO';
      } else {
        dados.status = 'BLOQUEADO';
      }

      if (dados.tipoVeiculo !== TipoVeiculo.CAMINHAO) {
        if (dados.visitante) {
          dados.empresa = 'Visitante';
        } else {
          dados.empresa = 'Conexão Maritima';
        }
      }

      this.veiculoService.cadastrarVeiculo(dados).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.tipoToast.set('success');
          this.mensagemToast.set('Veiculo registrado com sucesso!');
          this.mostrarToast.set(true);


          this.veiculoForm.reset({
            numeroPlaca: '',
            cor: '',
            visitante: false,
            tipoVeiculo: null,
            statusVeiculo: StatusVeiculo.ATIVO,
            proprietario: {
              nome: '',
              cpfProprietario: '',
            },
            empresa: ''
          });

          this.veiculoService.notificarNovoCadastro();

        },
        error: (err) => {
          this.isLoading.set(false);
          this.mostrarToast.set(true);
          this.tipoToast.set('error');

          let msg = 'Ocorreu um erro inesperado.';

        
          if (Array.isArray(err.error)) {
            msg = err.error.map((e: any) => e.mensagem || e.defaultMessage).join(', ');
          }

          
          else {
            switch (err.status) {
              case 400:
                msg = err.error?.mensagem || 'Dados inválidos. Verifique os campos.';
                break;
              case 401:
                msg = 'Sessão expirada. Por favor, faça login novamente.';
                break;
              case 403:
                msg = err.error?.mensagem || 'Acesso negado ou veículo bloqueado para esta ação.';
                break;
              case 404:
                msg = err.error?.mensagem || 'Registro não encontrado.';
                break;
              case 409:
                msg = err.error?.mensagem || 'Conflito: Este CPF ou Placa já consta no sistema.';
                break;
              case 0:
                msg = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
                break;
              default:
                msg = `Erro na API: ${err.error?.mensagem || err.message}`;
            }
          }

          this.mensagemToast.set(msg);
        }
      })
    }
  }

  onCancel() {
    this.resetForm();
    console.log('Cancelado');
  }

}
