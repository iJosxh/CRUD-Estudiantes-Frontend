import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  ActualizarEstudianteRequest,
  CrearEstudianteRequest,
  EstudianteService
} from '../services/estudiante';

import {
  CatalogoDetalle,
  CatalogoService
} from '../../../core/services/catalogo';

import {
  UsuarioDisponible,
  UsuarioService
} from '../../../core/services/usuario';

@Component({
  selector: 'app-estudiante-form',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './estudiante-form.html',
  styleUrl: './estudiante-form.css'
})
export class EstudianteForm implements OnInit {

  idEstudiante: number | null = null;

  modoEdicion = signal(false);

  nombre = '';
  apellido = '';
  seccion = '';

  idNivel: number | null = null;
  idEstado: number | null = null;
  idUsuario: number | null = null;

  niveles =
    signal<CatalogoDetalle[]>([]);

  estados =
    signal<CatalogoDetalle[]>([]);

  usuarios =
    signal<UsuarioDisponible[]>([]);

  errorMessage = signal('');

  guardando = signal(false);

  estudianteCargado = false;

  constructor(
    private estudianteService: EstudianteService,
    private catalogoService: CatalogoService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.idEstudiante = Number(id);

      this.modoEdicion.set(true);

    }

    this.cargarNiveles();
    this.cargarEstados();
    this.cargarUsuarios();
  }

  cargarNiveles(): void {

    this.catalogoService
      .getNiveles()
      .subscribe({

        next: (niveles) => {

          this.niveles.set(niveles);

          this.verificarCargaEdicion();
        },

        error: (error) => {

          console.error(
            'Error al cargar niveles:',
            error
          );

          this.manejarErrorCarga(
            error,
            'No fue posible cargar los niveles.'
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

          if (!this.modoEdicion()) {

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

          }

          this.verificarCargaEdicion();
        },

        error: (error) => {

          console.error(
            'Error al cargar estados:',
            error
          );

          this.manejarErrorCarga(
            error,
            'No fue posible cargar los estados.'
          );

        }

      });

  }

  cargarUsuarios(): void {

    this.usuarioService
      .getDisponiblesEstudiantes()
      .subscribe({

        next: (usuarios) => {

          this.usuarios.set(usuarios);

          this.verificarCargaEdicion();
        },

        error: (error) => {

          console.error(
            'Error al cargar usuarios:',
            error
          );

          this.manejarErrorCarga(
            error,
            'No fue posible cargar los usuarios disponibles.'
          );

        }

      });

  }

  verificarCargaEdicion(): void {

    if (
      !this.modoEdicion() ||
      !this.idEstudiante ||
      this.estudianteCargado
    ) {
      return;
    }

    if (
      this.niveles().length === 0 ||
      this.estados().length === 0
    ) {
      return;
    }

    this.estudianteCargado = true;

    this.cargarEstudiante();
  }

  cargarEstudiante(): void {

    if (!this.idEstudiante) {
      return;
    }

    this.errorMessage.set('');

    this.estudianteService
      .getEstudiante(
        this.idEstudiante
      )
      .subscribe({

        next: (estudiante) => {

          console.log(
            'ESTUDIANTE A EDITAR:',
            estudiante
          );

          this.nombre =
            estudiante.nombre ?? '';

          this.apellido =
            estudiante.apellido ?? '';

          this.seccion =
            estudiante.seccion ?? '';

          this.idNivel =
            estudiante.nivel
              ?.idCatalogoDetalle
            ??
            estudiante.idNivel
            ??
            null;

          this.idEstado =
            estudiante.estado
              ?.idCatalogoDetalle
            ??
            estudiante.idEstado
            ??
            null;

          this.idUsuario =
            estudiante.usuario
              ?.idUsuario
            ??
            estudiante.idUsuario
            ??
            null;

          if (
            estudiante.usuario &&
            !this.usuarios().some(
              usuario =>
                usuario.idUsuario ===
                estudiante.usuario.idUsuario
            )
          ) {

            this.usuarios.set([
              {
                idUsuario:
                  estudiante.usuario.idUsuario,

                username:
                  estudiante.usuario.username
              },

              ...this.usuarios()
            ]);

          }

        },

        error: (error) => {

          console.error(
            'Error al cargar estudiante:',
            error
          );

          if (error.status === 400) {

            this.errorMessage.set(
              'El identificador del estudiante no es válido.'
            );

          } else if (error.status === 401) {

            this.errorMessage.set(
              'Tu sesión ha expirado.'
            );

          } else if (error.status === 403) {

            this.errorMessage.set(
              'No tienes permisos para consultar este estudiante.'
            );

          } else if (error.status === 404) {

            this.errorMessage.set(
              'El estudiante no existe.'
            );

          } else if (error.status === 500) {

            this.errorMessage.set(
              'Ocurrió un error en el servidor.'
            );

          } else {

            this.errorMessage.set(
              error.error?.message ??
              'No fue posible cargar el estudiante.'
            );

          }

        }

      });

  }

  guardar(): void {

    this.errorMessage.set('');

    if (
      !this.nombre.trim() ||
      !this.apellido.trim() ||
      !this.seccion.trim() ||
      !this.idNivel ||
      !this.idUsuario ||
      !this.idEstado
    ) {

      this.errorMessage.set(
        'Todos los campos son obligatorios.'
      );

      return;
    }

    if (this.modoEdicion()) {

      this.actualizar();

    } else {

      this.crear();

    }

  }

  crear(): void {

    const estudiante:
      CrearEstudianteRequest = {

      nombre:
        this.nombre.trim(),

      apellido:
        this.apellido.trim(),

      seccion:
        this.seccion
          .trim()
          .toUpperCase(),

      idNivel:
        Number(this.idNivel),

      idEstado:
        Number(this.idEstado),

      idUsuario:
        Number(this.idUsuario)

    };

    this.guardando.set(true);

    this.estudianteService
      .crearEstudiante(estudiante)
      .subscribe({

        next: () => {

          this.guardando.set(false);

          this.router.navigate([
            '/estudiantes'
          ]);

        },

        error: (error) => {

          this.guardando.set(false);

          this.manejarErrorGuardado(
            error
          );

        }

      });

  }

  actualizar(): void {

    if (!this.idEstudiante) {
      return;
    }

    const estudiante:
      ActualizarEstudianteRequest = {

      nombre:
        this.nombre.trim(),

      apellido:
        this.apellido.trim(),

      seccion:
        this.seccion
          .trim()
          .toUpperCase(),

      idNivel:
        Number(this.idNivel),

      idEstado:
        Number(this.idEstado),

      idUsuario:
        Number(this.idUsuario)

    };

    this.guardando.set(true);

    this.estudianteService
      .actualizarEstudiante(
        this.idEstudiante,
        estudiante
      )
      .subscribe({

        next: () => {

          this.guardando.set(false);

          this.router.navigate([
            '/estudiantes'
          ]);

        },

        error: (error) => {

          this.guardando.set(false);

          this.manejarErrorGuardado(
            error
          );

        }

      });

  }

  manejarErrorCarga(
    error: any,
    mensajeDefault: string
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
        mensajeDefault
      );

    }

  }

  manejarErrorGuardado(
    error: any
  ): void {

    console.error(
      'Error al guardar estudiante:',
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
        'No tienes permisos para realizar esta operación.'
      );

    } else if (error.status === 404) {

      this.errorMessage.set(
        'El estudiante no existe.'
      );

    } else if (error.status === 409) {

      this.errorMessage.set(
        error.error?.message ??
        'Existe un conflicto con los datos ingresados.'
      );

    } else if (error.status === 500) {

      this.errorMessage.set(
        'Ocurrió un error en el servidor.'
      );

    } else {

      this.errorMessage.set(
        error.error?.message ??
        'No fue posible guardar el estudiante.'
      );

    }

  }

}