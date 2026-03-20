import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-search-bar',
  imports: [NgClass],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  @Input() containerClass: string = 'w-64 h-12';
  @Input() placeholder: string = 'Buscar';
  @Output() aoPesquisar = new EventEmitter<string>();

  private debounceTimer: any;

  onInput(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      console.log('Emitindo busca:', valor); 
      this.aoPesquisar.emit(valor);
    }, 300);
  }
}
