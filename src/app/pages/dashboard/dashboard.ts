import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { Tabela } from '../../shared/tabela/tabela';
import { VeiculoService } from '../../services/services/veiculo.service';
import { Veiculo } from '../../models/veiculo';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-dashboard',
  imports: [SearchBar, Tabela, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {
  constructor(
    private veiculoService: VeiculoService,
    private cdr: ChangeDetectorRef
  ) { }

  veiculoSelecionado: Veiculo | null = null;
  
  veiculos: Veiculo[] = [];
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  ngOnInit() {
    this.carregarVeiculos();
    this.veiculoService.veiculoAdicionado$.subscribe(() => {
      console.log('Novo veiculo adicionado');
      this.carregarVeiculos();
    })
  }

  carregarVeiculos() {
    this.veiculoService.obterVeiculo(this.currentPage, this.pageSize).subscribe({
      next: response => {
        this.veiculos = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.cdr.detectChanges();
        console.log('Veículos carregados:', this.veiculos);
      },
      error: err => console.error('Erro ao carregar veículos:', err)
    });
  }

  alterarTamanhoPagina(novoTamanho: number) {
    this.pageSize = novoTamanho;
    this.currentPage = 0;
    this.carregarVeiculos();
  }

  alterarPagina(novaPagina: number) {
    this.currentPage = novaPagina;
    this.carregarVeiculos();
    this.cdr.detectChanges();
  }

  selecionarVeiculo(veiculo: Veiculo) {
    if (this.veiculoSelecionado?.proprietario.idProprietario === veiculo.proprietario.idProprietario) {
      this.veiculoSelecionado = null;
    } else {
      this.veiculoSelecionado = veiculo;
    }
  }

  // No seu dashboard.ts

  toggleBloqueio(veiculo: any) {
    if (!veiculo) return;

    // 1. Inverte o estado local (exemplo)
    veiculo.bloqueado = !veiculo.bloqueado;

    // 2. Aqui você chamaria o seu serviço para salvar no banco de dados
    console.log(`Veículo ${veiculo.numeroPlaca} agora está: ${veiculo.bloqueado ? 'BLOQUEADO' : 'LIBERADO'}`);

    // Exemplo de chamada ao serviço:
    // this.veiculoService.atualizarStatusBloqueio(veiculo.id, veiculo.bloqueado).subscribe({
    //   next: () => console.log('Status atualizado com sucesso'),
    //   error: (err) => console.error('Erro ao bloquear veículo', err)
    // });
  }
}