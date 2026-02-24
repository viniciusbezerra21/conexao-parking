import { Routes } from '@angular/router';
import { PaginaLogin } from './pages/pagina-login/pagina-login';
import { CadastroForm } from './pages/cadastro-form/cadastro-form';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
    { path: '', component: PaginaLogin },
    { path: 'cadastro', component: CadastroForm },
    { path: 'dashboard', component: Dashboard }
    
];
