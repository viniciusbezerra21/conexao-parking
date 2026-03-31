import { Routes } from '@angular/router';
import { PaginaLogin } from './pages/pagina-login/pagina-login';
import { CadastroForm } from './pages/cadastro-form/cadastro-form';
import { Dashboard } from './pages/dashboard/dashboard';
import { Layout } from './components/layout/layout';
import { LiberarEntrada } from './pages/liberar-entrada/liberar-entrada';
import { LiberarSaida } from './pages/liberar-saida/liberar-saida';
import { CadastrarVeiculo } from './pages/cadastrar-veiculo/cadastrar-veiculo';
import { TabelaDeVeiculos } from './pages/tabela-de-veiculos/tabela-de-veiculos';
import { TabelaUsuarios } from './pages/tabela-usuarios/tabela-usuarios';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: 'cadastro', component: CadastroForm, canActivate: [adminGuard] },
    { path: 'login', component: PaginaLogin },
    { path: '', component: PaginaLogin },

    {
        path: '',
        component: Layout,
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
            { path: 'liberar-entrada', component: LiberarEntrada },
            { path: 'liberar-saida', component: LiberarSaida },
            { path: 'cadastro-veiculo', component: CadastrarVeiculo },
            { path: 'tabela-de-veiculos', component: TabelaDeVeiculos  },
            { path: 'tabela-usuarios', component: TabelaUsuarios, canActivate: [adminGuard] }
        ]
    }
];