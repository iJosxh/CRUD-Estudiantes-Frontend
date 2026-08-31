import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  Asignacion,
  AsignacionService
} from '../services/asignacion';

import {
  AuthService
} from '../../../core/services/auth';

@Component({
  selector: 'app-estudiante-cursos',
  standalone: true,
  imports: [],
  templateUrl: './estudiante-cursos.html',
  styleUrl: './estudiante-cursos.css'
})
export class EstudianteCursos implements OnInit {

  asignaciones =
    signal<Asignacion[]>([]);

  errorMessage =
    signal('');

  esAdministrador =
    signal(false);

  constructor(
    private asignacionService: AsignacionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.esAdministrador.set(
      this.authService.isAdmin()
    );

    this.cargarCursos();

  }

  cargarCursos(): void {

    this.errorMessage.set('');

    if (this.esAdministrador()) {

      this.cargarTodasAsignaciones();

    } else {

      this.cargarMisCursos();

    }

  }

  cargarTodasAsignaciones(): void {

    this.asignacionService
      .getAsignaciones()
      .subscribe({

        next: (asignaciones) => {

          this.asignaciones.set(
            asignaciones
          );

        },

        error: (error) => {

          console.error(
            'Error al cargar asignaciones:',
            error
          );

          this.manejarError(error);

        }

      });

  }

  cargarMisCursos(): void {

    this.asignacionService
      .getMisCursos()
      .subscribe({

        next: (asignaciones) => {

          this.asignaciones.set(
            asignaciones
          );

        },

        error: (error) => {

          console.error(
            'Error al cargar mis cursos:',
            error
          );

          this.manejarError(error);

        }

      });

  }

  manejarError(error: any): void {

    if (error.status === 401) {

      this.errorMessage.set(
        'Tu sesión ha expirado.'
      );

    } else if (error.status === 403) {

      this.errorMessage.set(
        'No tienes permisos para consultar los cursos.'
      );

    } else if (error.status === 500) {

      this.errorMessage.set(
        'Ocurrió un error en el servidor.'
      );

    } else {

      this.errorMessage.set(
        error.error?.message ??
        'No fue posible cargar los cursos.'
      );

    }

  }

}
