import { NgClass } from '@angular/common';
import { Component, computed, effect, input, output } from '@angular/core';


export type ToastType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-toast',
  imports: [NgClass],
  standalone: true,
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  mensagem = input<string>('');
  visivel = input<boolean>(false);
  tipo = input<ToastType>('success');
  duracao = input<number>(3000);

  fechar = output<void>();


  config = computed(() => {
    const type = this.tipo();
    const baseContainer = "flex items-center gap-3 bg-white px-6 py-4 rounded-lg shadow-2xl border-l-4";
    const baseIconBg = "p-2 rounded-full";
    const baseIcon = "h-5 w-5";

    switch (type) {
      case 'error':
        return {
          title: 'Erro!',
          containerClasses: `${baseContainer} border-red-600`,
          iconBgClasses: `${baseIconBg} bg-red-100`,
          iconClasses: `${baseIcon} text-red-600`,
          iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' 
        };
      case 'warning':
        return {
          title: 'Atenção!',
          containerClasses: `${baseContainer} border-yellow-500`,
          iconBgClasses: `${baseIconBg} bg-yellow-100`,
          iconClasses: `${baseIcon} text-yellow-600`,
          iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' 
        };
      case 'info':
        return {
          title: 'Informação',
          containerClasses: `${baseContainer} border-blue-600`,
          iconBgClasses: `${baseIconBg} bg-blue-100`,
          iconClasses: `${baseIcon} text-blue-600`,
          iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
        };
      case 'success':
      default:
        return {
          title: 'Sucesso!',
          containerClasses: `${baseContainer} border-green-600`,
          iconBgClasses: `${baseIconBg} bg-green-100`,
          iconClasses: `${baseIcon} text-green-600`,
          iconPath: 'M5 13l4 4L19 7' 
        };
    }
  });

  constructor() {
    effect(() => {
      if (this.visivel()) {
        setTimeout(() => this.fechar.emit(), this.duracao()); 
      }
    });
  }


}
