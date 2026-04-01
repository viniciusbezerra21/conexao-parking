import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { SearchBar } from '../../shared/search-bar/search-bar';
import { Tabela } from '../../shared/tabela/tabela';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { UsuarioService, DadosListagemUsuario, DadosAtualizacaoUsuario } from '../../services/services/usuario.service';
import { AuthService } from '../../services/services/auth.service';
import { Toast, ToastType } from '../../shared/toast/toast';

@Component({
  selector: 'app-tabela-usuarios',
  imports: [SearchBar, Tabela, FormsModule, NgClass, Toast],
  templateUrl: './tabela-usuarios.html',
  styleUrl: './tabela-usuarios.css',
})
export class TabelaUsuarios implements OnInit {
  constructor(
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService
  ) { }

  usuarios: DadosListagemUsuario[] = [];
  usuariosExibicao: DadosListagemUsuario[] = [];
  usuarioSelecionado: DadosListagemUsuario | null = null;
  
  totalPages = 0;
  currentPage = 0;
  pageSize = 5;

  readonly isLoadingBusca = signal(false);

  // Toast Control
  mensagemToast = signal('');
  mostrarToast = signal(false);
  tipoToast = signal<ToastType>('success');

  // Edit fields
  novaSenha = signal('');

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
    if (this.usuarioSelecionado?.idUsuario === user.idUsuario) {
      this.usuarioSelecionado = null;
      this.novaSenha.set('');
    } else {
      this.usuarioSelecionado = user;
      this.novaSenha.set('');
    }
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

  promoverAdmin() {
    if (!this.usuarioSelecionado) return;

    this.usuarioService.tornarAdmin(this.usuarioSelecionado.idUsuario).subscribe({
      next: () => {
        this.exibirToast('Usuário promovido a administrador com sucesso!', 'success');
        this.usuarioSelecionado = null;
        this.carregarUsuarios();
      },
      error: () => this.exibirToast('Erro ao promover usuário.', 'error')
    });
  }

  excluirUsuario() {
    if (!this.usuarioSelecionado) return;

    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuarioService.excluir(this.usuarioSelecionado.idUsuario).subscribe({
        next: () => {
          this.exibirToast('Usuário excluído com sucesso!', 'success');
          this.usuarioSelecionado = null;
          this.carregarUsuarios();
        },
        error: () => this.exibirToast('Erro ao excluir usuário.', 'error')
      });
    }
  }

  salvarEdicao() {
    if (!this.usuarioSelecionado) return;

    const dados = {
      idUsuario: this.usuarioSelecionado.idUsuario,
      emailCorporativo: this.usuarioSelecionado.emailCorporativo,
      novaSenha: this.novaSenha() || undefined
    };

    this.usuarioService.atualizar(this.usuarioSelecionado.idUsuario, dados).subscribe({
      next: () => {
        this.exibirToast('Usuário atualizado com sucesso!', 'success');
        this.usuarioSelecionado = null;
        this.carregarUsuarios();
      },
      error: () => this.exibirToast('Erro ao atualizar usuário.', 'error')
    });
  }

  private exibirToast(mensagem: string, tipo: ToastType) {
    this.mensagemToast.set(mensagem);
    this.tipoToast.set(tipo);
    this.mostrarToast.set(true);
  }
}
