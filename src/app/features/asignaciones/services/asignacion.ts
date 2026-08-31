import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

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
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      asignacion
    );
  }

  getAsignaciones(): Observable<any[]> {

    return this.http.get<any[]>(
      this.apiUrl
    );
  }

  getPorEstudiante(
    idEstudiante: number
  ): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/estudiante/${idEstudiante}`
    );
  }

  getMisCursos(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUrl}/mis-cursos`
    );
  }
}
