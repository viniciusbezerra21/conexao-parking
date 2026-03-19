import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { Tabela } from '../../shared/tabela/tabela';
import { VeiculoService } from '../../services/services/veiculo.service';
import { Veiculo } from '../../models/veiculo';
import { Toast, ToastType } from "../../shared/toast/toast";

@Component({
  selector: 'app-tabela-de-veiculos',
  standalone: true,
  imports: [SearchBar, Tabela, FormsModule, CommonModule, Toast],
  templateUrl: './tabela-de-veiculos.html',
  styleUrl: './tabela-de-veiculos.css',
})
export class TabelaDeVeiculos implements OnInit {
  veiculos: Veiculo[] = [];
  veiculosExibicao: Veiculo[] = [];
  todosVeiculos: Veiculo[] = [];
  veiculoSelecionado: Veiculo | null = null;
  veiculoOriginal: any = null;
  readonly mostrarToast = signal(false);
  readonly mensagemToast = signal('');
  readonly tipoToast = signal<ToastType>('success');

  readonly isLoadingInicial = signal(false);
  readonly isLoadingBusca = signal(false);
  readonly isLoadingRegistro = signal(false);

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
    this.isLoadingBusca.set(true);
    this.veiculoService.obterVeiculo(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.veiculos = response.content;
        this.veiculosExibicao = [...this.veiculos];
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.cdr.detectChanges();

        this.isLoadingBusca.set(false);
        console.log('Veiculos Carregados', this.veiculos);
      },
      error: (err) => {
        console.error('Erro ao buscar veiculos:', err);
        this.isLoadingBusca.set(false);
      },
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
          this.mostrarToast.set(true);
          this.mensagemToast.set('Veículo editado com sucesso!');
          this.tipoToast.set('success');

          this.carregarVeiculos();  

          this.veiculoOriginal = JSON.parse(JSON.stringify(res));
          this.carregarTodosParaBusca();
          this.veiculoSelecionado = null;
        },
        error: (err) => {
          this.mostrarToast.set(true);
          this.mensagemToast.set('Erro ao editar veículo. Verifique o console.');
          this.tipoToast.set('error');
        }
      });
    }
  }

  excluirVeiculo(idVeiculo: number) {
    this.veiculoService.deletarVeiculo(idVeiculo).subscribe({
      next: () => {
        this.mostrarToast.set(true);
        this.mensagemToast.set('Veiculo excluido!');
        this.tipoToast.set('warning');

        this.carregarVeiculos();
        this.carregarTodosParaBusca();
      }
    })
  }

  bloquearVeiculo(veiculo: Veiculo) {
    const novoStatus = !veiculo.bloqueado;

    this.veiculoService.alternarBloqueio(veiculo.idVeiculo, novoStatus).subscribe({
      next: (veiculoAtualizado) => {
        this.mostrarToast.set(true);
        this.mensagemToast.set(`Veiculo ${novoStatus ? 'bloqueado' : 'desbloqueado'} com sucesso!`);
        this.tipoToast.set('warning');

        veiculo.bloqueado = veiculoAtualizado.bloqueado;
        this.carregarVeiculos();
        this.carregarTodosParaBusca();
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 403 || err.status === 401) {
          this.mostrarToast.set(true);
          this.mensagemToast.set('Veiculo bloqueado!' + err.message);
          this.tipoToast.set('error');
        } else if (err.status === 404) {
          this.mostrarToast.set(true);
          this.mensagemToast.set('Veiculo nao encontrado.' + err.message);
          this.tipoToast.set('error');
        } else {
          this.mostrarToast.set(true);
          this.mensagemToast.set('Erro ao registrar veiculo na API.' + err.message);
          this.tipoToast.set('error');
        }

        this.cdr.detectChanges();
      }
    })
  }


}