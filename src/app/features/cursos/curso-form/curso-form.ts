import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  CrearCursoRequest,
  CursoService
} from '../services/curso';

import {
  CatalogoDetalle,
  CatalogoService
} from '../../../core/services/catalogo';

import {
  Catedratico,
  CatedraticoService
} from '../../../core/services/catedratico';

@Component({
  selector: 'app-curso-form',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './curso-form.html',
  styleUrl: './curso-form.css'
})
export class CursoForm implements OnInit {

  nombreCurso = '';

  idNivel: number | null = null;
  idGrado: number | null = null;
  idCarrera: number | null = null;
  idEstado: number | null = null;
  idCatedratico: number | null = null;

  niveles =
    signal<CatalogoDetalle[]>([]);

  grados =
    signal<CatalogoDetalle[]>([]);

  carreras =
    signal<CatalogoDetalle[]>([]);

  estados =
    signal<CatalogoDetalle[]>([]);

  catedraticos =
    signal<Catedratico[]>([]);

  errorMessage = signal('');
  successMessage = signal('');
  guardando = signal(false);

  constructor(
    private cursoService: CursoService,
    private catalogoService: CatalogoService,
    private catedraticoService: CatedraticoService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.cargarNiveles();
    this.cargarGrados();
    this.cargarCarreras();
    this.cargarEstados();
    this.cargarCatedraticos();

  }

  cargarNiveles(): void {

    this.catalogoService
      .getNiveles()
      .subscribe({

        next: (niveles) => {
          this.niveles.set(niveles);
        },

        error: (error) => {
          this.manejarErrorCarga(
            error,
            'No fue posible cargar los niveles.'
          );
        }

      });

  }

  cargarGrados(): void {

    this.catalogoService
      .getGrados()
      .subscribe({

        next: (grados) => {
          this.grados.set(grados);
        },

        error: (error) => {
          this.manejarErrorCarga(
            error,
            'No fue posible cargar los grados.'
          );
        }

      });

  }

  cargarCarreras(): void {

    this.catalogoService
      .getCarreras()
      .subscribe({

        next: (carreras) => {
          this.carreras.set(carreras);
        },

        error: (error) => {
          this.manejarErrorCarga(
            error,
            'No fue posible cargar las carreras.'
          );
        }

      });

  }

  cargarEstados(): void {

    this.catalogoService
      .getEstados()
      .subscribe({

        next: (estados) => {

          this.estados.set(estados);

          const activo =
            estados.find(
              estado =>
                estado.nombre
                  .toLowerCase() ===
                'activo'
            );

          if (activo) {
            this.idEstado =
              activo.idCatalogoDetalle;
          }

        },

        error: (error) => {
          this.manejarErrorCarga(
            error,
            'No fue posible cargar los estados.'
          );
        }

      });

  }

  cargarCatedraticos(): void {

    this.catedraticoService
      .getCatedraticos()
      .subscribe({

        next: (catedraticos) => {

          // Solo mostramos catedráticos activos.
          const activos =
            catedraticos.filter(
              catedratico =>
                catedratico.estado
                  ?.nombre
                  ?.toLowerCase() !==
                'inactivo'
            );

          this.catedraticos.set(
            activos
          );

        },

        error: (error) => {
          this.manejarErrorCarga(
            error,
            'No fue posible cargar los catedráticos.'
          );
        }

      });

  }

  guardar(): void {

    this.errorMessage.set('');
    this.successMessage.set('');

    if (
      !this.nombreCurso.trim() ||
      !this.idNivel ||
      !this.idGrado ||
      !this.idCarrera ||
      !this.idEstado ||
      !this.idCatedratico
    ) {

      this.errorMessage.set(
        'Todos los campos son obligatorios.'
      );

      return;
    }

    const curso: CrearCursoRequest = {

      nombreCurso:
        this.nombreCurso.trim(),

      idNivel:
        Number(this.idNivel),

      idGrado:
        Number(this.idGrado),

      idCarrera:
        Number(this.idCarrera),

      idEstado:
        Number(this.idEstado),

      idCatedratico:
        Number(this.idCatedratico)

    };

    this.guardando.set(true);

    this.cursoService
      .crearCurso(curso)
      .subscribe({

        next: () => {

          this.guardando.set(false);

          this.successMessage.set(
            'Curso creado correctamente.'
          );

          this.limpiarFormulario();

        },

        error: (error) => {

          this.guardando.set(false);

          console.error(
            'Error al crear curso:',
            error
          );

          if (error.status === 400) {

            this.errorMessage.set(
              error.error?.message ??
              'Los datos ingresados no son válidos.'
            );

          } else if (error.status === 401) {

            this.errorMessage.set(
              'Tu sesión ha expirado.'
            );

          } else if (error.status === 403) {

            this.errorMessage.set(
              'No tienes permisos para crear cursos.'
            );

          } else if (error.status === 404) {

            this.errorMessage.set(
              error.error?.message ??
              'Uno de los datos seleccionados no existe.'
            );

          } else if (error.status === 409) {

            this.errorMessage.set(
              error.error?.message ??
              'Ya existe un curso con estos datos.'
            );

          } else if (error.status === 500) {

            this.errorMessage.set(
              'Ocurrió un error en el servidor.'
            );

          } else {

            this.errorMessage.set(
              error.error?.message ??
              'No fue posible crear el curso.'
            );

          }

        }

      });

  }

  limpiarFormulario(): void {

    this.nombreCurso = '';

    this.idNivel = null;
    this.idGrado = null;
    this.idCarrera = null;
    this.idCatedratico = null;

    const activo =
      this.estados().find(
        estado =>
          estado.nombre
            .toLowerCase() ===
          'activo'
      );

    this.idEstado =
      activo?.idCatalogoDetalle ??
      null;

  }

  manejarErrorCarga(
    error: any,
    mensaje: string
  ): void {

    console.error(
      'Error al cargar información:',
      error
    );

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
