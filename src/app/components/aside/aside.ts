import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aside',
  imports: [],
  templateUrl: './aside.html',
  styleUrl: './aside.css',
})
export class Aside {
  constructor(private router: Router) { }


  irParaDashboard() {
    this.router.navigate(['/dashboard']);
  }
  
  irAoLiberarEntrada() {
    this.router.navigate(['/liberar-entrada']);
  }

  irAoLiberarSaida() {
    this.router.navigate(['/liberar-saida']);
  }

  irAoCadastroDeVeiculo() {
    this.router.navigate(['/cadastro-veiculo']);
  }

}
