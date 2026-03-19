import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { Tabela } from '../../shared/tabela/tabela';
import { MovimentacaoService } from '../../services/services/movimentacao.service';
import { Movimentacao } from '../../models/movimentacao';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { VeiculoService } from '../../services/services/veiculo.service';

@Component({
  selector: 'app-dashboard',
  imports: [SearchBar, Tabela, FormsModule, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  constructor(
    private veiculoService: VeiculoService,
    private movimentacaoService: MovimentacaoService,
    private cdr: ChangeDetectorRef
  ) { }

  
  movimentacoes: Movimentacao[] = [];
  movimentacoesExibicao: Movimentacao[] = [];
  movimentacaoSelecionada: Movimentacao | null = null;
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  readonly isLoadingInicial = signal(false);
  readonly isLoadingBusca = signal(false);
  readonly isLoadingRegistro = signal(false);
  
  private mapaTipoVeiculo = new Map<string, string>();

  ngOnInit() {
    this.carregarMovimentacoes();
    this.carregarMapa();
  }

  carregarMovimentacoes() {
    this.isLoadingBusca.set(true);
    this.movimentacaoService.listar(this.currentPage, this.pageSize).subscribe({
      next: response => {
        this.movimentacoes = response.content;
        this.movimentacoesExibicao = [...this.movimentacoes];

        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.cdr.detectChanges();

        this.isLoadingBusca.set(false);
      },
      
      error: err => {
        console.error('Erro ao buscar movimentações:', err);
        this.isLoadingBusca.set(false)
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

  obterTipoVeiculo(placa: string): string {
    return this.mapaTipoVeiculo.get(placa) || 'N/A';
  }

  filtrar(termo: string) {
    const t = termo.toLowerCase();


    this.movimentacoesExibicao = this.movimentacoes.filter(m =>
      m.nomeProprietario.toLowerCase().includes(t) ||
      m.cpfProprietario.toLowerCase().includes(t) ||
      m.numeroPlaca.toLowerCase().includes(t)
    );
  }

  selecionarMovimentacao(mov: Movimentacao) {
    this.movimentacaoSelecionada = (this.movimentacaoSelecionada?.id === mov.id) ? null : mov;
  }

  alterarPagina(novaPagina: number) {
    this.currentPage = novaPagina;
    this.carregarMovimentacoes();
  }

  alterarTamanhoPagina(novoTamanho: number) {
    this.pageSize = novoTamanho;
    this.currentPage = 0; 
    this.carregarMovimentacoes();
  }
}