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

  idReferencia = input<number | null | undefined>(null);

  @Output() confirmarAcao = new EventEmitter<{ id: number, observacao: string | null }>();


  observacaoControl = new FormControl('');

  onClickLiberar() {
    const v = this.veiculo();

    // --- DEBUG DE SEGURANÇA ---
    console.log("DEBUG: Conteúdo do objeto veiculo():", v);
    if (v) {
      console.log("DEBUG: Chaves existentes no objeto:", Object.keys(v));
    }
    // --------------------------

    const id = v?.idVeiculo;

    if (id) {
      this.confirmarAcao.emit({
        id: id,
        observacao: this.observacaoControl.value
      });
    } else {
      console.warn("Nenhum ID encontrado. Verifique se o nome da propriedade é 'idVeiculo' ou 'id'.");
    }
  }
  
}
