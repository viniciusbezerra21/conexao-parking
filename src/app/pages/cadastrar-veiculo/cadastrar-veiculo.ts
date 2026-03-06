import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VeiculoService } from '../../services/services/veiculo.service';
import { StatusVeiculo, TipoVeiculo } from '../../models/veiculo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastrar-veiculo',
  imports: [ReactiveFormsModule],
  templateUrl: './cadastrar-veiculo.html',
  styleUrl: './cadastrar-veiculo.css',
})
export class CadastrarVeiculo {
  private fb = inject(FormBuilder);
  private veiculoService = inject(VeiculoService);
  private router = inject(Router);

  veiculoForm = this.fb.group({
    numeroPlaca: ['', [Validators.required]],
    cor: ['', [Validators.required]],
    visitante: [false],
    bloqueado: [false],
    tipoVeiculo: [TipoVeiculo , [Validators.required]],
    statusVeiculo: [StatusVeiculo.ATIVO, [Validators.required]],
    proprietario: this.fb.group({
      nome: ['', [Validators.required]],
      cpfProprietario: ['', [Validators.required]]
    })
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
      }
    });

    this.router.navigate(['/dashboard']);
  }


  onSubmit() {
    if (this.veiculoForm.valid) {
      const dados = this.veiculoForm.value as any;

      this.veiculoService.cadastrarVeiculo(dados).subscribe({
        next: (res) => {
          alert('Veiculo cadastrado com sucesso!');
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
            }
          });

          this.veiculoService.notificarNovoCadastro();
            
        },
        error: (err) => {
          alert('Erro ao cadastrar veiculo');
        }
      })
    }
  }

  onCancel() {
    this.resetForm();
    console.log('Cancelado');
  }

}
