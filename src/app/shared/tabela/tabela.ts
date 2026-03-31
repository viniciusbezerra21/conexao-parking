import { ChangeDetectorRef, Component, EventEmitter, Input, Output, output } from '@angular/core';

@Component({
  selector: 'app-tabela',
  imports: [],
  templateUrl: './tabela.html',
  styleUrl: './tabela.css',
})
export class Tabela {
  constructor(private cdr: ChangeDetectorRef) { }

  @Input() paginaAtual = 0;
  @Input() totalPaginas = 0;
  @Input() modoCompacto: boolean = false;
  @Input() colunas: string[] = ['Proprietário', 'Tipo veículo', 'CPF', 'Número placa', 'Status'];

  @Output() mudarPagina = new EventEmitter<number>();
  @Output() mudarTamanho = new EventEmitter<number>();

  proximaPagina() {
    if (this.paginaAtual + 1 < this.totalPaginas) {
      this.mudarPagina.emit(this.paginaAtual + 1);
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 0) {
      this.mudarPagina.emit(this.paginaAtual - 1);
    }
  }

  alterarTamanho(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.mudarTamanho.emit(Number(select.value));
  }

  aoMudarTamanho(event: Event) {
    const select = event.target as HTMLSelectElement;
    const novoTamanho = Number(select.value);
    this.mudarTamanho.emit(novoTamanho);
    this.cdr.detectChanges();
    
  }

  atualizarEstado(paginaAtual: number, totalPaginas: number) {
    this.paginaAtual = paginaAtual;
    this.totalPaginas = totalPaginas;
  }
}
