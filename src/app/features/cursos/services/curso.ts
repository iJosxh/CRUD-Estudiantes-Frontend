import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface CatalogoCurso {
  idCatalogoDetalle: number;
  nombre: string;
}

export interface CatedraticoCurso {
  idCatedratico: number;
  nombre: string;
  apellido: string;
}

export interface Curso {
  idCurso: number;
  nombreCurso: string;

  nivel: CatalogoCurso;
  grado: CatalogoCurso;
  carrera: CatalogoCurso | null;
  estado: CatalogoCurso;

  catedratico: CatedraticoCurso;
}

export interface CrearCursoRequest {
  nombreCurso: string;
  idNivel: number;
  idGrado: number;
  idCarrera: number;
  idEstado: number;
  idCatedratico: number;
}

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private readonly apiUrl =
    `${environment.apiUrl}/cursos`;

  constructor(
    private http: HttpClient
  ) {}

  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(
      this.apiUrl
    );
  }

  crearCurso(
    curso: CrearCursoRequest
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      curso
    );
  }
}