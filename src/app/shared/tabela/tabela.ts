import { Component, output } from '@angular/core';

@Component({
  selector: 'app-tabela',
  imports: [],
  templateUrl: './tabela.html',
  styleUrl: './tabela.css',
})
export class Tabela {
  paginaAtual = 0;
  totalPaginas = 0;

  mudarPagina = output<number>();

  proximaPagina() {
    if (this.paginaAtual + 1 < this.totalPaginas) {
      this.paginaAtual++;
      this.mudarPagina.emit(this.paginaAtual);
    }
  }

  paginaAnterior() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.mudarPagina.emit(this.paginaAtual);
    }
  }

  atualizarEstado(paginaAtual: number, totalPaginas: number) {
    this.paginaAtual = paginaAtual;
    this.totalPaginas = totalPaginas;
  }
}
