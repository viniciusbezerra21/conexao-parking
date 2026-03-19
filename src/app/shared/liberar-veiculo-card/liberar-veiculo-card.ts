import { Component, EventEmitter, input, output, Output } from '@angular/core';
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
  veiculo = input<any | null | undefined>(null);

  idReferencia = input<number | null | undefined>(null);

  @Output() confirmarAcao = new EventEmitter<{ id: number, observacao: string | null }>();
  isLoading = input<boolean>(false);
  cancelarSelecao = output<void>();

  observacaoControl = new FormControl('');

  onClickLiberar() {
    const v = this.veiculo();

    const idParaLiberar = this.idReferencia() ?? (v as any)?.idVeiculo ?? (v as any)?.id;

    if (idParaLiberar) {
      this.confirmarAcao.emit({
        id: idParaLiberar,
        observacao: this.observacaoControl.value
      });
    } else {
      console.error("DEBUG: Não foi possível identificar o ID. Objeto:", v);
    }
  }

  aoCancelar() {
    this.cancelarSelecao.emit();
  }

  
}