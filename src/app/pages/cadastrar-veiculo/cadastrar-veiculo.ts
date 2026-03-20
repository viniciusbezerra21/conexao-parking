import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VeiculoService } from '../../services/services/veiculo.service';
import { StatusVeiculo, TipoVeiculo } from '../../models/veiculo';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { Toast, ToastType } from "../../shared/toast/toast";

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
    numeroPlaca: ['', [Validators.required]],
    cor: ['', [Validators.required]],
    visitante: [false],
    bloqueado: [false],
    tipoVeiculo: [null as TipoVeiculo | null, [Validators.required]],
    statusVeiculo: [StatusVeiculo.ATIVO, [Validators.required]],
    proprietario: this.fb.group({
      nome: ['', [Validators.required]],
      cpfProprietario: ['', [Validators.required]]
    }),
    empresa: ['']
  })

  private resetForm() {
    this.veiculoForm.reset({
      numeroPlaca: '',
      cor: '',
      visitante: false,
      bloqueado: false,
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
        empresaControl?.setValidators([Validators.required]);
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
      const dados = this.veiculoForm.value as any;

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
            bloqueado: false,
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
          if (err.status === 403 || err.status === 401) {
            this.mostrarToast.set(true);
            this.mensagemToast.set('Jé existe um veiculo com essa placa ou um proprietário com esse CPF.' + err.message);
            this.tipoToast.set('error');
          } else if (err.status === 404) {
            this.mostrarToast.set(true);
            this.mensagemToast.set('Veiculo nao encontrado.' + err.message);
            this.tipoToast.set('error');
          } else {
            this.mostrarToast.set(true);
            this.mensagemToast.set('Erro ao registrar veiculo na API.' + err.message);
            this.tipoToast.set('error');
          }
        }
      })
    }
  }

  onCancel() {
    this.resetForm();
    console.log('Cancelado');
  }

}
