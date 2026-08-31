import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'Ingresa usuario y contraseña.';
      return;
    }

    this.loading = true;

    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;

        const rol = this.authService.getRol();

        if (rol === 'Administrador') {
          this.router.navigate(['/estudiantes']);
          return;
        }

        if (rol === 'Estudiante') {
          this.router.navigate(['/estudiante-cursos']);
          return;
        }

        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading = false;

        if (error.status === 401) {
          this.errorMessage = 'Usuario o contraseña incorrectos.';
        } else {
          this.errorMessage = 'No fue posible iniciar sesión.';
        }
      }
    });
  }
}