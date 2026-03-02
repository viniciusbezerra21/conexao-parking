import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { Tabela } from '../../shared/tabela/tabela';
import { VeiculoService } from '../../services/services/veiculo.service';
import { Veiculo } from '../../models/veiculo';


@Component({
  selector: 'app-dashboard',
  imports: [SearchBar, Tabela],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  constructor(
    private veiculoService: VeiculoService,
    private cdr: ChangeDetectorRef
  ) { }
  
  veiculos: Veiculo[] = [];
  totalPages = 0;
  currentPage = 0;

  ngOnInit() {
    this.carregarVeiculos();
  }

  carregarVeiculos() {
    this.veiculoService.obterVeiculo(this.currentPage).subscribe({
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
}