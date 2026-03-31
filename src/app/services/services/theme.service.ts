import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  constructor() {
    
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'dark') {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark');
    } else if (temaSalvo === 'light') {
      this.isDarkMode.set(false);
      document.documentElement.classList.remove('dark');
    } else {
      const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefereEscuro) {
        this.isDarkMode.set(true);
        document.documentElement.classList.add('dark');
      }
    }
  }

  toggleTheme() {
    const novoStatus = !this.isDarkMode();
    this.isDarkMode.set(novoStatus);
    
    if (novoStatus) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tema', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tema', 'light');
    }
  }
}
