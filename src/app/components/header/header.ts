import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(
    private router: Router,
    private authService: AuthService,
    private eRef: ElementRef
  ) { }

  
  irParaDashboard() {
    this.router.navigate(['dashboard']);
  }
  
  menuAberto = false;

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.menuAberto = false;
    }
  }

}
