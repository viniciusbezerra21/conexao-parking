import { Component, EventEmitter, input, Output } from '@angular/core';
import { Veiculo } from '../../models/veiculo';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-liberar-veiculo-card',
  imports: [ReactiveFormsModule],
  templateUrl: './liberar-veiculo-card.html',
  styleUrl: './liberar-veiculo-card.css',
})
export class LiberarVeiculoCard {
  veiculo = input<Veiculo | null>(null);

  @Output() liberar = new EventEmitter<{ idMovimentacao: number, observacao: string | null }>();

  observacaoControl = new FormControl('');

  onClickLiberar() {
    const veiculoAtual = this.veiculo();

    if (veiculoAtual && veiculoAtual.idVeiculo) {
      this.liberar.emit({
        idMovimentacao: veiculoAtual?.idVeiculo as number,
        observacao: this?.observacaoControl.value
      })
    } else {
      console.error('Veículo nulo ou sem ID');
    }
  }
  
}
