import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  Estudiante,
  EstudianteService
} from '../../estudiantes/services/estudiante';

import {
  Curso,
  CursoService
} from '../../cursos/services/curso';

import {
  AsignacionService,
  CrearAsignacionRequest
} from '../services/asignacion';

@Component({
  selector: 'app-asignacion-form',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './asignacion-form.html',
  styleUrl: './asignacion-form.css'
})
export class AsignacionForm implements OnInit {

  idEstudiante: number | null = null;
  idCurso: number | null = null;

  estudiantes =
    signal<Estudiante[]>([]);

  cursos =
    signal<Curso[]>([]);

  errorMessage =
    signal('');

  successMessage =
    signal('');

  asignando =
    signal(false);

  constructor(
    private estudianteService: EstudianteService,
    private cursoService: CursoService,
    private asignacionService: AsignacionService
  ) {}

  ngOnInit(): void {

    this.cargarEstudiantes();
    this.cargarCursos();

  }

  cargarEstudiantes(): void {

    this.estudianteService
      .getEstudiantes()
      .subscribe({

        next: (estudiantes) => {

          const activos =
            estudiantes.filter(
              estudiante =>
                estudiante.estado
                  ?.toLowerCase() !==
                'inactivo'
            );

          this.estudiantes.set(
            activos
          );

        },

        error: (error) => {

          console.error(
            'Error al cargar estudiantes:',
            error
          );

          this.manejarErrorCarga(
            error,
            'No fue posible cargar los estudiantes.'
          );

        }

      });

  }

  cargarCursos(): void {

    this.cursoService
      .getCursos()
      .subscribe({

        next: (cursos) => {

          const activos =
            cursos.filter(
              curso =>
                curso.estado
                  ?.nombre
                  ?.toLowerCase() !==
                'inactivo'
            );

          this.cursos.set(
            activos
          );

        },

        error: (error) => {

          console.error(
            'Error al cargar cursos:',
            error
          );

          this.manejarErrorCarga(
            error,
            'No fue posible cargar los cursos.'
          );

        }

      });

  }

  asignar(): void {

    this.errorMessage.set('');
    this.successMessage.set('');

    if (
      !this.idEstudiante ||
      !this.idCurso
    ) {

      this.errorMessage.set(
        'Debes seleccionar un estudiante y un curso.'
      );

      return;
    }

    const asignacion:
      CrearAsignacionRequest = {

      idEstudiante:
        Number(this.idEstudiante),

      idCurso:
        Number(this.idCurso)

    };

    this.asignando.set(true);

    this.asignacionService
      .crearAsignacion(asignacion)
      .subscribe({

        next: () => {

          this.asignando.set(false);

          this.successMessage.set(
            'Curso asignado correctamente.'
          );

          this.idEstudiante = null;
          this.idCurso = null;

        },

        error: (error) => {

          this.asignando.set(false);

          console.error(
            'Error al asignar curso:',
            error
          );

          if (error.status === 400) {

            this.errorMessage.set(
              error.error?.message ??
              'Los datos de la asignación no son válidos.'
            );

          } else if (error.status === 401) {

            this.errorMessage.set(
              'Tu sesión ha expirado.'
            );

          } else if (error.status === 403) {

            this.errorMessage.set(
              'No tienes permisos para asignar cursos.'
            );

          } else if (error.status === 404) {

            this.errorMessage.set(
              error.error?.message ??
              'El estudiante o curso seleccionado no existe.'
            );

          } else if (error.status === 409) {

            this.errorMessage.set(
              error.error?.message ??
              'El curso ya está asignado a este estudiante.'
            );

          } else if (error.status === 500) {

            this.errorMessage.set(
              'Ocurrió un error en el servidor.'
            );

          } else {

            this.errorMessage.set(
              error.error?.message ??
              'No fue posible asignar el curso.'
            );

          }

        }

      });

  }

  manejarErrorCarga(
    error: any,
    mensaje: string
  ): void {

    if (error.status === 401) {

      this.errorMessage.set(
        'Tu sesión ha expirado.'
      );

    } else if (error.status === 403) {

      this.errorMessage.set(
        'No tienes permisos para consultar esta información.'
      );

    } else if (error.status === 500) {

      this.errorMessage.set(
        'Ocurrió un error en el servidor.'
      );

    } else {

      this.errorMessage.set(
        error.error?.message ??
        mensaje
      );

    }

  }

}
