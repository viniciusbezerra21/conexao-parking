import { Component, OnInit, signal } from '@angular/core';
import { SearchBar } from "../../shared/search-bar/search-bar";
import { LiberarVeiculoCard } from "../../shared/liberar-veiculo-card/liberar-veiculo-card";
import { VeiculoService } from '../../services/services/veiculo.service';
import { Veiculo } from '../../models/veiculo';
import { MovimentacaoService } from '../../services/services/movimentacao.service';
import { ToastType, Toast } from '../../shared/toast/toast';

@Component({
  selector: 'app-liberar-entrada',
  standalone: true,
  imports: [SearchBar, LiberarVeiculoCard, Toast],
  templateUrl: './liberar-entrada.html',
  styleUrl: './liberar-entrada.css',
})
export class LiberarEntrada implements OnInit {
  private readonly listaCompleta = signal<Veiculo[]>([]);
  readonly resultados = signal<Veiculo[]>([]);
  readonly veiculoSelecionado = signal<Veiculo | null>(null);
  readonly mostrarToast = signal(false);
  readonly mensagemToast = signal('');
  readonly tipoToast = signal<ToastType>('success');

  constructor(
    private readonly veiculoService: VeiculoService,
    private readonly movimentacaoService: MovimentacaoService
  ) { }

  ngOnInit(): void {
    this.carregarVeiculos();
  }

  private carregarVeiculos(): void {
    this.veiculoService.obterTodosParaBusca().subscribe({
      next: (res) => {

        this.listaCompleta.set(res.content || res);
        console.log('Veículos sincronizados para busca');
      },
      error: (err) => console.error('Erro ao carregar veículos:', err)
    });
  }

  filtrar(termo: string): void {
    if (!termo || termo.length < 3) {
      this.resultados.set([]);
      return;
    }

    const t = termo.toLowerCase();


    const filtrados = this.listaCompleta().filter(v =>
      v.proprietario.nome.toLowerCase().includes(t) ||
      v.proprietario.cpfProprietario.toLowerCase().includes(t) ||
      v.numeroPlaca.toLowerCase().includes(t)
    );

    this.resultados.set(filtrados);
  }

  isLoadingDetalhamento = signal(false);

  selecionarVeiculo(v: Veiculo): void {
    this.resultados.set([]);
    this.isLoadingDetalhamento.set(true); 

    this.veiculoService.detalhar(v.idVeiculo).subscribe({
      next: (veiculoCompleto) => {
        this.veiculoSelecionado.set(veiculoCompleto);
        this.isLoadingDetalhamento.set(false); 
      },
      error: () => this.isLoadingDetalhamento.set(false)
    });
  }

  registrarEntrada(evento: { id: number, observacao: string | null }): void {

    if (!evento.id) {
      console.warn('Tentativa de registro sem ID de veículo.');
      return;
    }

    this.movimentacaoService.liberarEntrada(evento.id, evento.observacao).subscribe({
      next: (res) => {
        this.tipoToast.set('success');
        this.mensagemToast.set('Entrada registrada com sucesso!');
        this.mostrarToast.set(true);

        this.veiculoSelecionado.set(null);
      },
      error: (err) => {
        this.tipoToast.set('error');
        this.mensagemToast.set('Erro ao registrar entrada na API. Verifique o console.');
      }
    });
  }
}