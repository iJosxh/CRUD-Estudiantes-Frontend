import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

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

  crearCurso(
    curso: CrearCursoRequest
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      curso
    );
  }
}