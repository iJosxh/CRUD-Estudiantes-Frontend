import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  CrearUsuarioRequest,
  UsuarioService
} from '../../../core/services/usuario';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  username = '';
  password = '';

  idRol: number | null = null;

  errorMessage = signal('');
  guardando = signal(false);

  roles = [
    {
      id: 1,
      nombre: 'Administrador'
    },
    {
      id: 2,
      nombre: 'Estudiante'
    }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  registrar(): void {

    this.errorMessage.set('');

    if (
      !this.username.trim() ||
      !this.password.trim() ||
      !this.idRol
    ) {
      this.errorMessage.set(
        'Todos los campos son obligatorios.'
      );

      return;
    }

    const usuario: CrearUsuarioRequest = {
      username: this.username.trim(),
      password: this.password,
      idRol: Number(this.idRol),

      // 3 = Activo
      idEstado: 3
    };

    this.guardando.set(true);

    this.usuarioService
      .crearUsuario(usuario)
      .subscribe({

        next: () => {

          this.guardando.set(false);

          this.router.navigate(
            ['/login'],
            {
              queryParams: {
                registrado: 'true'
              }
            }
          );

        },

        error: (error) => {

          this.guardando.set(false);

          if (error.status === 409) {

            this.errorMessage.set(
              error.error?.message ??
              'El nombre de usuario ya existe.'
            );

          } else if (error.status === 400) {

            this.errorMessage.set(
              error.error?.message ??
              'Los datos ingresados no son válidos.'
            );

          } else {

            this.errorMessage.set(
              error.error?.message ??
              'No fue posible crear el usuario.'
            );

          }

        }

      });

  }

}