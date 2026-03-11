import { Component, signal } from '@angular/core';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { LiberarVeiculoCard } from '../../shared/liberar-veiculo-card/liberar-veiculo-card';
import { Veiculo } from '../../models/veiculo';
import { VeiculoService } from '../../services/services/veiculo.service';
import { MovimentacaoService } from '../../services/services/movimentacao.service';

@Component({
  selector: 'app-liberar-saida',
  imports: [SearchBar, LiberarVeiculoCard],
  templateUrl: './liberar-saida.html',
  styleUrl: './liberar-saida.css',
})
export class LiberarSaida {
  listaCompleta: Veiculo[] = [];
  resultados: Veiculo[] = [];
  veiculoSelecionado = signal<Veiculo | null>(null);

  constructor(
    private veiculoService: VeiculoService,
    private movimentacaoService: MovimentacaoService
  ) { }

  ngOnInit() {
    this.veiculoService.obterTodosParaBusca().subscribe(res => {
      this.listaCompleta = res.content;
      console.log('Veículos carregados:', this.listaCompleta);
    });
  }

  filtrar(termo: string): Veiculo[] {
    if (!termo || termo.length < 3) {
      return [];
    }

    const t = termo.toLowerCase();


    return this.resultados = [...this.listaCompleta.filter(v =>
      v.proprietario.nome.toLowerCase().includes(t) ||
      v.proprietario.cpfProprietario.toLowerCase().includes(t) ||
      v.numeroPlaca.toLowerCase().includes(t)
    )];
  }

  selecionarVeiculo(v: Veiculo) {
    this.veiculoSelecionado.set(v);
    this.resultados = [];
  }

  registrarSaida(evento: { id: number, observacao: string | null }) {
    this.movimentacaoService.liberarSaida(evento.id, evento.observacao).subscribe({
      next: (res) => console.log('Saída liberada!', res),
      error: (err) => console.error('Erro na saída', err)
    });
  }
}
