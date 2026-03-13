import { Component, signal } from '@angular/core';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { LiberarVeiculoCard } from '../../shared/liberar-veiculo-card/liberar-veiculo-card';
import { MovimentacaoService } from '../../services/services/movimentacao.service';
import { Movimentacao } from '../../models/movimentacao';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-liberar-saida',
  imports: [SearchBar, LiberarVeiculoCard],
  templateUrl: './liberar-saida.html',
  styleUrl: './liberar-saida.css',
})
export class LiberarSaida {
  listaCompleta = signal<Movimentacao[]>([]);
  resultados = signal<Movimentacao[]>([]);

  movimentacaoSelecionada = signal<Movimentacao | null>(null);

  private readonly _idMovimentacaoSelecionada = signal<number | null>(null);

  get idMovimentacaoSelecionada() {
    return this._idMovimentacaoSelecionada.asReadonly();
  }

  constructor(private movimentacaoService: MovimentacaoService) { }

  ngOnInit() {
    this.movimentacaoService.listar().subscribe(res => {
      // res.content é o array que vem do seu JSON
      this.listaCompleta.set(res.content.filter((m: Movimentacao) => !m.dataSaida));
    });
  }

  filtrar(termo: string): void {
    if (!termo || termo.length < 3) {
      this.resultados.set([]);
      return;
    }
    const t = termo.toLowerCase();
    this.resultados.set(this.listaCompleta().filter(m =>
      m.numeroPlaca.toLowerCase().includes(t) || m.nomeProprietario.toLowerCase().includes(t)
    ));
  }

  selecionarMovimentacao(m: Movimentacao) {
    this._idMovimentacaoSelecionada.set(m.id);
    this.movimentacaoSelecionada.set(m); 
    this.resultados.set([]);
  }

  registrarSaida(evento: { observacao: string | null }) {
    const id = this.idMovimentacaoSelecionada();
    if (!id) return;

    this.movimentacaoService.liberarSaida(id, evento.observacao).subscribe({
      next: () => {
        alert('Saída registrada com sucesso!');
        this.movimentacaoSelecionada.set(null);
        this._idMovimentacaoSelecionada.set(null);
      }
    });
  }
}