import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { Tabela } from '../../shared/tabela/tabela';
import { VeiculoService } from '../../services/services/veiculo.service';
import { Veiculo } from '../../models/veiculo';

@Component({
  selector: 'app-tabela-de-veiculos',
  standalone: true,
  imports: [SearchBar, Tabela, FormsModule, CommonModule],
  templateUrl: './tabela-de-veiculos.html',
  styleUrl: './tabela-de-veiculos.css',
})
export class TabelaDeVeiculos implements OnInit {
  veiculos: Veiculo[] = [];
  veiculosExibicao: Veiculo[] = [];
  todosVeiculos: Veiculo[] = [];
  veiculoSelecionado: Veiculo | null = null;
  veiculoOriginal: any = null;

  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  constructor(
    private veiculoService: VeiculoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.carregarVeiculos();
    this.carregarTodosParaBusca();

    this.veiculoService.veiculoAdicionado$.subscribe(() => {
      this.carregarVeiculos();
      this.carregarTodosParaBusca();
    });
  }

  carregarVeiculos() {
    this.veiculoService.obterVeiculo(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.veiculos = response.content;
        this.veiculosExibicao = [...this.veiculos];
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.cdr.detectChanges();
        console.log('Veiculos Carregados', this.veiculos);
      },
      error: (err) => console.error('Erro ao buscar veículos:', err),
    });
  }

  carregarTodosParaBusca() {
    this.veiculoService.obterTodosParaBusca().subscribe({
      next: (res) => this.todosVeiculos = res.content,
      error: (err) => console.error('Erro ao carregar índice de busca:', err)
    });
  }

  filtrar(termo: string) {
    if (!termo.trim()) {
      this.veiculosExibicao = [...this.veiculos];
      return;
    }

    const t = termo.toLowerCase();
    this.veiculosExibicao = this.todosVeiculos.filter(
      (v) =>
        v.proprietario.nome.toLowerCase().includes(t) ||
        v.proprietario.cpfProprietario.includes(t) ||
        v.numeroPlaca.toLowerCase().includes(t)
    );
  }

  selecionarVeiculo(veiculo: Veiculo) {
    if (this.veiculoSelecionado?.idVeiculo === veiculo.idVeiculo) {
      this.veiculoSelecionado = null;
      this.veiculoOriginal = null;
    } else {
      this.veiculoSelecionado = veiculo;
      this.veiculoOriginal = { ...veiculo };
    }
  }

  alterarPagina(novaPagina: number) {
    this.currentPage = novaPagina;
    this.carregarVeiculos();
  }

  alterarTamanhoPagina(novoTamanho: number) {
    this.pageSize = novoTamanho;
    this.currentPage = 0;
    this.carregarVeiculos();
  }

  temAlteracao(): boolean {
    if (!this.veiculoSelecionado || !this.veiculoOriginal) return false;
    return JSON.stringify(this.veiculoSelecionado) !== JSON.stringify(this.veiculoOriginal);
  } 

  salvarEdicao() {
    if (this.veiculoSelecionado) {
    
      this.veiculoService.editarVeiculo(this.veiculoSelecionado).subscribe({
        next: (res) => {
          // Atualiza a referência original com o que voltou do servidor
          this.veiculoOriginal = JSON.parse(JSON.stringify(res));
          this.carregarTodosParaBusca();
          this.veiculoSelecionado = null;

          // Opcional: Feedback visual de sucesso
          console.log('Veículo editado com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao editar veículo:', err);
          alert('Não foi possível salvar as alterações.');
        }
      });
    }
  }

  excluirVeiculo(idVeiculo: number) {
    this.veiculoService.deletarVeiculo(idVeiculo).subscribe({
      next: () => {
        this.carregarVeiculos();
        this.carregarTodosParaBusca();
      }
    })
  }

  bloquearVeiculo(veiculo: Veiculo) {
    const novoStatus = !veiculo.bloqueado;

    this.veiculoService.alternarBloqueio(veiculo.idVeiculo, novoStatus).subscribe({
      next: (veiculoAtualizado) => {
        veiculo.bloqueado = veiculoAtualizado.bloqueado;
        this.carregarVeiculos();
        this.carregarTodosParaBusca();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao processar bloqueio na API:', err);
        alert('Ocorreu um erro ao processar o bloqueio. Verifique o console.');
        this.cdr.detectChanges();
      }
    })
  }


}