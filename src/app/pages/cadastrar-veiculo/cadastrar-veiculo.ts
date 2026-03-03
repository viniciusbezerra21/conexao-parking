import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VeiculoService } from '../../services/services/veiculo.service';
import { StatusVeiculo, TipoVeiculo, Proprietario } from '../../models/veiculo';
import { CadastroForm } from "../cadastro-form/cadastro-form";

@Component({
  selector: 'app-cadastrar-veiculo',
  imports: [ReactiveFormsModule, CadastroForm],
  templateUrl: './cadastrar-veiculo.html',
  styleUrl: './cadastrar-veiculo.css',
})
export class CadastrarVeiculo {
  private fb = inject(FormBuilder);
  private veiculoService = inject(VeiculoService);

  veiculoForm = this.fb.group({
    numeroPlaca: ['', [Validators.required]],
    cor: ['', [Validators.required]],
    visitante: [false],
    bloqueado: [false],
    TipoVeiculo: [TipoVeiculo , [Validators.required]],
    statusVeiculo: [StatusVeiculo, [Validators.required]],
    Proprietario: this.fb.group({
      nome: ['', [Validators.required]],
      cpfProprietario: ['', [Validators.required]]
    })
  })


  onSubmit() {
    if (this.veiculoForm.valid) {
      const dados = this.veiculoForm.value as any;

      this.veiculoService.cadastrarVeiculo(dados).subscribe({
        next: (res) => {
          alert('Veiculo cadastrado com sucesso!');
          this.veiculoForm.reset();
        },
        error: (err) => {
          alert('Erro ao cadastrar veiculo');
        }
      })
    }
  }

}
