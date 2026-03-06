import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { Tabela } from '../../shared/tabela/tabela';
import { VeiculoService } from '../../services/services/veiculo.service';
import { Veiculo } from '../../models/veiculo';
import { trigger, state, style, transition, animate } from '@angular/animations';


@Component({
  selector: 'app-dashboard',
  imports: [SearchBar, Tabela],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  animations: [
    trigger('slideInOut', [
      state('void', style({ width: '0', opacity: 0, overflow: 'hidden' })),
      state('*', style({ width: '350px', opacity: 1 })),
      transition('void <=> *', animate('300ms ease-in-out'))
    ])
  ]
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
  }

  selecionarVeiculo(veiculo: Veiculo) {
    this.veiculoSelecionado = veiculo;
  }

}