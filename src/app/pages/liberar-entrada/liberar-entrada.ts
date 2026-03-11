import { Component, OnInit, signal } from '@angular/core';
import { SearchBar } from "../../shared/search-bar/search-bar";
import { LiberarVeiculoCard } from "../../shared/liberar-veiculo-card/liberar-veiculo-card";
import { VeiculoService } from '../../services/services/veiculo.service';
import { Veiculo } from '../../models/veiculo';
import { MovimentacaoService } from '../../services/services/movimentacao.service';

@Component({
  selector: 'app-liberar-entrada',
  imports: [SearchBar, LiberarVeiculoCard],
  templateUrl: './liberar-entrada.html',
  styleUrl: './liberar-entrada.css',
})
export class LiberarEntrada implements OnInit {
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

  onEfetuarLiberacao(dados: {idMovimentacao: number, observacao: string | null}) {
    this.movimentacaoService.liberarEntrada(dados).subscribe({
      next: (resposta) => {
        console.log('Liberação efetuada com sucesso!');
        alert('Liberação efetuada com sucesso!');
        
      }
    })
  }
  
}
