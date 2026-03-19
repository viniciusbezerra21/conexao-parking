import { Component, signal, OnInit, computed, ChangeDetectorRef } from '@angular/core';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { LiberarVeiculoCard } from '../../shared/liberar-veiculo-card/liberar-veiculo-card';
import { MovimentacaoService } from '../../services/services/movimentacao.service';
import { Movimentacao } from '../../models/movimentacao';
import { TipoVeiculo } from '../../models/veiculo';
import { Toast, ToastType } from "../../shared/toast/toast";
import { VeiculoService } from '../../services/services/veiculo.service';

@Component({
  selector: 'app-liberar-saida',
  standalone: true,
  imports: [SearchBar, LiberarVeiculoCard, Toast],
  templateUrl: './liberar-saida.html',
  styleUrl: './liberar-saida.css',
})
export class LiberarSaida implements OnInit {

  listaCompleta = signal<Movimentacao[]>([]);
  resultados = signal<Movimentacao[]>([]);

  private mapaTipoVeiculo = new Map<string, string>();

  readonly mostrarToast = signal(false);
  readonly mensagemToast = signal('');
  readonly tipoToast = signal<ToastType>('success');
  
  
  readonly isLoadingInicial = signal(false);
  readonly isLoadingBusca = signal(false);
  readonly isLoadingRegistro = signal(false);
  readonly isLoadingDetalhamento = signal(false);

  movimentacaoSelecionada = signal<Movimentacao | null>(null);
  private readonly _idMovimentacaoSelecionada = signal<number | null>(null);

  get idMovimentacaoSelecionada() {
    return this._idMovimentacaoSelecionada.asReadonly();
  }
  
  constructor(
    private movimentacaoService: MovimentacaoService,
    private cdr: ChangeDetectorRef,
    private veiculoService: VeiculoService
  ) { }
  
  ngOnInit() {
    this.carregarDadosIniciais();
    this.carregarMapa();
  }

  private carregarDadosIniciais() {
    this.isLoadingInicial.set(true);
    this.movimentacaoService.listar().subscribe({
      next: (res) => {
        
        this.listaCompleta.set(res.content.filter((m: Movimentacao) => !m.dataSaida));
        this.isLoadingInicial.set(false);
      },
      error: (err) => {
        this.isLoadingInicial.set(false);
        this.exibirNotificacao('Erro ao carregar movimentações.', 'error');
      }
    });
  }

  carregarMapa() {
    this.veiculoService.obterVeiculo(0, 1000).subscribe({
      next: res => {
        res.content.forEach(v => {
          this.mapaTipoVeiculo.set(v.numeroPlaca, v.tipoVeiculo);
        });
        this.cdr.detectChanges();
      }
    });
  }

  filtrar(termo: string): void {
    if (!termo || termo.length < 3) {
      this.resultados.set([]);
      return;
    }
    
    this.isLoadingBusca.set(true); 
    const t = termo.toLowerCase();
    
    const filtrados = this.listaCompleta().filter(m =>
      m.numeroPlaca.toLowerCase().includes(t) ||
      m.nomeProprietario.toLowerCase().includes(t)
    );
    
    this.resultados.set(filtrados);
    this.isLoadingBusca.set(false);
  }

  selecionarMovimentacao(m: Movimentacao) {
    this.isLoadingDetalhamento.set(true); 

  
    this._idMovimentacaoSelecionada.set(m.id);
    this.movimentacaoSelecionada.set(m);
    this.resultados.set([]);

    
    setTimeout(() => this.isLoadingDetalhamento.set(false), 300);
  }


  obterTipoVeiculo(placa: string): string {
    return this.mapaTipoVeiculo.get(placa) || 'N/A';
  }


  veiculoParaCard = computed(() => {
    const m = this.movimentacaoSelecionada();
    if (!m) return null;

    return {
      numeroPlaca: m.numeroPlaca,
      tipoVeiculo: this.obterTipoVeiculo(m.numeroPlaca),
      cor: 'N/A',
      bloqueado: false,
      proprietario: {
        nome: m.nomeProprietario,
        cpfProprietario: m.cpfProprietario
      }
    };
  });
  
  registrarSaida(evento: { observacao: string | null }) {
    const id = this.idMovimentacaoSelecionada();
    if (!id) return;
    
    this.isLoadingRegistro.set(true); 
    
    this.movimentacaoService.liberarSaida(id, evento.observacao).subscribe({
      next: (res) => {
        this.isLoadingRegistro.set(false);
        this.exibirNotificacao('Saída registrada com sucesso!', 'success');
        
        
        this.listaCompleta.update(lista => lista.filter(item => item.id !== id));
        this.movimentacaoSelecionada.set(null);
        this._idMovimentacaoSelecionada.set(null);
      },
      error: (err) => {
        this.isLoadingRegistro.set(false);
        const msg = err.status === 403 || err.status === 401
          ? 'Veículo bloqueado!'
          : 'Erro ao registrar saída na API.';
        this.exibirNotificacao(msg, 'error');
      }
    });
  }

  limparVeiculoSelecionado(): void {
    this.movimentacaoSelecionada.set(null);
    this._idMovimentacaoSelecionada.set(null);
    this.resultados.set([]);
    this.exibirNotificacao('Seleção cancelada.', 'info');
  }

  private exibirNotificacao(mensagem: string, tipo: ToastType) {
    this.mensagemToast.set(mensagem);
    this.tipoToast.set(tipo);
    this.mostrarToast.set(true);
  }
}
