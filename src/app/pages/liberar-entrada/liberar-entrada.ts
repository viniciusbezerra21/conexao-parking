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

  readonly isLoadingInicial = signal(false);
  readonly isLoadingBusca = signal(false);
  readonly isLoadingRegistro = signal(false);

  constructor(
    private readonly veiculoService: VeiculoService,
    private readonly movimentacaoService: MovimentacaoService,
  ) { }

  ngOnInit(): void {
    this.carregarVeiculos();
  }

  private carregarVeiculos(): void {
    this.isLoadingInicial.set(true);
    this.veiculoService.obterTodosParaBusca().subscribe({
      
      next: (res) => {
        this.isLoadingInicial.set(false);
        this.listaCompleta.set(res.content || res);
        console.log('Veículos sincronizados para busca');
      },
      error: (err) => {
        this.isLoadingInicial.set(false);
        console.error('Erro ao buscar veículos:', err);
      }
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
    this.isLoadingRegistro.set(true);
    if (!evento.id) {
      console.warn('Tentativa de registro sem ID de veículo.');
      return;
    }

    this.movimentacaoService.liberarEntrada(evento.id, evento.observacao).subscribe({
      next: (res) => {
        this.tipoToast.set('success');
        this.mensagemToast.set('Entrada registrada com sucesso!');
        this.mostrarToast.set(true);
        this.isLoadingRegistro.set(false);

        this.veiculoSelecionado.set(null);
      },
      error: (err) => {
        let mensagem = 'Ocorreu um erro inesperado.'; 
        this.isLoadingRegistro.set(false);

        if (err.status === 401 || err.status === 403) {
          mensagem = 'Veículo bloqueado ou sem permissão.';
        } else if (err.status === 404) {
          mensagem = 'Veículo não encontrado.';
        } else if (err.status === 409) { 
          mensagem = 'Este veículo já possui uma entrada.';
        }

        
        this.mensagemToast.set(mensagem);
        this.tipoToast.set('error');
        this.mostrarToast.set(true);
        console.error(err);
      }
    });
  }

  

  limparVeiculoSelecionado(): void {
    this.isLoadingDetalhamento.set(false);
    this.isLoadingRegistro.set(false);
    

    this.veiculoSelecionado.set(null);
    this.resultados.set([]);

    this.tipoToast.set('info');
    this.mensagemToast.set('Seleção cancelada.');
    this.mostrarToast.set(true);
  }
}