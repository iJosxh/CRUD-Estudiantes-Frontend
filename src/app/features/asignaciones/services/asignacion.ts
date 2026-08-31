import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface CatalogoAsignacion {
  idCatalogoDetalle: number;
  nombre: string;
}

export interface CatedraticoAsignacion {
  idCatedratico: number;
  nombre: string;
  apellido: string;
}

export interface UsuarioAsignacion {
  idUsuario: number;
  username: string;
}

export interface EstudianteAsignacion {
  idEstudiante: number;
  nombre: string;
  apellido: string;
  seccion: string;

  usuario?: UsuarioAsignacion;
}

export interface CursoAsignacion {
  idCurso: number;
  nombreCurso: string;

  nivel: CatalogoAsignacion | null;
  grado: CatalogoAsignacion | null;
  carrera: CatalogoAsignacion | null;
  estado: CatalogoAsignacion | null;

  catedratico: CatedraticoAsignacion | null;
}

export interface Asignacion {
  idAsignacion: number;
  estudiante: EstudianteAsignacion;
  curso: CursoAsignacion;
}

export interface CrearAsignacionRequest {
  idEstudiante: number;
  idCurso: number;
}

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {

  private readonly apiUrl =
    `${environment.apiUrl}/asignaciones`;

  constructor(
    private http: HttpClient
  ) {}

  crearAsignacion(
    asignacion: CrearAsignacionRequest
  ): Observable<Asignacion> {

    return this.http.post<Asignacion>(
      this.apiUrl,
      asignacion
    );
  }

  getAsignaciones():
    Observable<Asignacion[]> {

    return this.http.get<Asignacion[]>(
      this.apiUrl
    );
  }

  getPorEstudiante(
    idEstudiante: number
  ): Observable<Asignacion[]> {

    return this.http.get<Asignacion[]>(
      `${this.apiUrl}/estudiante/${idEstudiante}`
    );
  }

  getMisCursos():
    Observable<Asignacion[]> {

    return this.http.get<Asignacion[]>(
      `${this.apiUrl}/mis-cursos`
    );
  }
}