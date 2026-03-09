import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-search-bar',
  imports: [NgClass],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  @Input() containerClass: string = 'w-64 h-12';
  @Input() placeholder: string = 'Buscar';
}
