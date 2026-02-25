import { Component } from '@angular/core';
import { SearchBar } from "../../shared/search-bar/search-bar";
import { Tabela } from "../../shared/tabela/tabela";

@Component({
  selector: 'app-dashboard',
  imports: [SearchBar, Tabela],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
