import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  username = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.username =
      this.authService.getUsuario()?.username ?? '';
  }

  logout(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
