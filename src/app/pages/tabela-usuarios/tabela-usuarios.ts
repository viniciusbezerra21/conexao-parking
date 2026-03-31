import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { Tabela } from '../../shared/tabela/tabela';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { UsuarioService, DadosListagemUsuario } from '../../services/services/usuario.service';

@Component({
  selector: 'app-tabela-usuarios',
  imports: [SearchBar, Tabela, FormsModule, NgClass],
  templateUrl: './tabela-usuarios.html',
  styleUrl: './tabela-usuarios.css',
})
export class TabelaUsuarios implements OnInit {
  constructor(
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) { }

  usuarios: DadosListagemUsuario[] = [];
  usuariosExibicao: DadosListagemUsuario[] = [];
  usuarioSelecionado: DadosListagemUsuario | null = null;
  
  totalPages = 0;
  currentPage = 0;
  pageSize = 5;

  readonly isLoadingBusca = signal(false);

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.isLoadingBusca.set(true);
    this.usuarioService.listar(this.currentPage, this.pageSize).subscribe({
      next: response => {
        this.usuarios = response.content;
        this.usuariosExibicao = [...this.usuarios];

        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.cdr.detectChanges();

        this.isLoadingBusca.set(false);
      },
      error: err => {
        console.error('Erro ao buscar usuários:', err);
        this.isLoadingBusca.set(false);
      }
    });
  }

  filtrar(termo: string) {
    const t = termo.toLowerCase();
    this.usuariosExibicao = this.usuarios.filter(u =>
      u.emailCorporativo.toLowerCase().includes(t) ||
      u.idUsuario.toString().includes(t)
    );
  }

  selecionarUsuario(user: DadosListagemUsuario) {
    this.usuarioSelecionado = (this.usuarioSelecionado?.idUsuario === user.idUsuario) ? null : user;
  }

  alterarPagina(novaPagina: number) {
    this.currentPage = novaPagina;
    this.carregarUsuarios();
  }

  alterarTamanhoPagina(novoTamanho: number) {
    this.pageSize = novoTamanho;
    this.currentPage = 0; 
    this.carregarUsuarios();
  }
}
