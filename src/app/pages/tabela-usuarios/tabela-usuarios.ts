
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
    } else {
      this.usuarioSelecionado = user;
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

  rebaixarParaUsuario() {
    if (!this.usuarioSelecionado) return;

    this.usuarioService.tornarUsuario(this.usuarioSelecionado.idUsuario).subscribe({
      next: () => {
        this.exibirToast('Usuário rebaixado a comum com sucesso!', 'success');
        this.usuarioSelecionado = null;
        this.carregarUsuarios();
      },
      error: () => this.exibirToast('Erro ao rebaixar usuário.', 'error')
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

  resetarSenhaUsuario() {
    if (!this.usuarioSelecionado) return;

    if (confirm('Tem certeza que deseja forçar o reset de senha deste usuário? Sua sessão atual será expirada.')) {
      this.usuarioService.resetarSenha(this.usuarioSelecionado.idUsuario).subscribe({
        next: () => {
          this.exibirToast('Senha resetada. A sessão do usuário foi encerrada. Ele será redirecionado para a página de troca (UI de Login) no próximo acesso.', 'success');
          this.usuarioSelecionado = null;
          this.carregarUsuarios();
        },
        error: () => this.exibirToast('Erro ao resetar a senha deste usuário.', 'error')
      });
    }
  }

  salvarEdicao() {
    if (!this.usuarioSelecionado) return;

    const dados = {
      idUsuario: this.usuarioSelecionado.idUsuario,
      emailCorporativo: this.usuarioSelecionado.emailCorporativo
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

  isAdminRole(role: any): boolean {
    if (!role) return false;
    // Tenta capturar o valor em caso de ser string (ex: 'ADMIN' ou 'ROLE_ADMIN') ou objeto
    const roleStr = typeof role === 'string' ? role : (role.name || role.authority || role.toString());
    return roleStr === 'ADMIN' || roleStr === 'ROLE_ADMIN';
  }

  getRoleFormatada(role: any): string {
    return this.isAdminRole(role) ? 'Administrador' : 'Usr. Comum';
  }

  private exibirToast(mensagem: string, tipo: ToastType) {
    this.mensagemToast.set(mensagem);
    this.tipoToast.set(tipo);
    this.mostrarToast.set(true);
  }
}