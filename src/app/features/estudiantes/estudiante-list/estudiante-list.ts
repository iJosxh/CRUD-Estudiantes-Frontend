import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';

import {
  Estudiante,
  EstudianteService
} from '../services/estudiante';

@Component({
  selector: 'app-estudiante-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './estudiante-list.html',
  styleUrl: './estudiante-list.css'
})
export class EstudianteList implements OnInit {

  estudiantes =
    signal<Estudiante[]>([]);

  errorMessage =
    signal('');

  successMessage =
    signal('');

  eliminandoId =
    signal<number | null>(null);

  constructor(
    private estudianteService: EstudianteService
  ) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {

    this.errorMessage.set('');

    this.estudianteService
      .getEstudiantes()
      .subscribe({

        next: (estudiantes) => {

          // Como el backend utiliza borrado lógico,
          // no mostramos estudiantes inactivos.
          const estudiantesActivos =
            estudiantes.filter(
              estudiante =>
                estudiante.estado
                  ?.toLowerCase() !==
                'inactivo'
            );

          this.estudiantes.set(
            estudiantesActivos
          );

        },

        error: (error) => {

          console.error(
            'Error al cargar estudiantes:',
            error
          );

          if (error.status === 401) {

            this.errorMessage.set(
              'Tu sesión ha expirado. Inicia sesión nuevamente.'
            );

          } else if (error.status === 403) {

            this.errorMessage.set(
              'No tienes permisos para consultar estudiantes.'
            );

          } else if (error.status === 500) {

            this.errorMessage.set(
              'Ocurrió un error en el servidor.'
            );

          } else {

            this.errorMessage.set(
              error.error?.message ??
              'No fue posible cargar los estudiantes.'
            );

          }

        }

      });

  }

  eliminar(
    estudiante: Estudiante
  ): void {

    this.errorMessage.set('');
    this.successMessage.set('');

    const confirmar =
      window.confirm(
        `¿Estás seguro de eliminar al estudiante ${estudiante.nombre} ${estudiante.apellido}?`
      );

    if (!confirmar) {
      return;
    }

    this.eliminandoId.set(
      estudiante.idEstudiante
    );

    this.estudianteService
      .eliminarEstudiante(
        estudiante.idEstudiante
      )
      .subscribe({

        next: () => {

          this.eliminandoId.set(null);

          this.estudiantes.update(
            estudiantes =>
              estudiantes.filter(
                item =>
                  item.idEstudiante !==
                  estudiante.idEstudiante
              )
          );

          this.successMessage.set(
            `El estudiante ${estudiante.nombre} ${estudiante.apellido} fue eliminado correctamente.`
          );

        },

        error: (error) => {

          this.eliminandoId.set(null);

          console.error(
            'Error al eliminar estudiante:',
            error
          );

          if (error.status === 401) {

            this.errorMessage.set(
              'Tu sesión ha expirado.'
            );

          } else if (error.status === 403) {

            this.errorMessage.set(
              'No tienes permisos para eliminar estudiantes.'
            );

          } else if (error.status === 404) {

            this.errorMessage.set(
              error.error?.message ??
              'El estudiante no existe.'
            );

          } else if (error.status === 500) {

            this.errorMessage.set(
              'Ocurrió un error en el servidor.'
            );

          } else {

            this.errorMessage.set(
              error.error?.message ??
              'No fue posible eliminar el estudiante.'
            );

          }

        }

      });

  }

}