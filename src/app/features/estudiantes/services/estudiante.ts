import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface UsuarioEstudiante {
  idUsuario: number;
  username: string;
}

export interface CursoAsignado {
  idAsignacion: number;
  idCurso: number;
  nombreCurso: string;
}

export interface Estudiante {
  idEstudiante: number;
  nombre: string;
  apellido: string;
  seccion: string;
  nivel: string;
  estado: string;
  usuario: UsuarioEstudiante;
  cursosAsignados: CursoAsignado[];
}

export interface CrearEstudianteRequest {
  nombre: string;
  apellido: string;
  seccion: string;
  idNivel: number;
  idEstado: number;
  idUsuario: number;
}

export interface ActualizarEstudianteRequest {
  nombre?: string;
  apellido?: string;
  seccion?: string;
  idNivel?: number;
  idEstado?: number;
  idUsuario?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private readonly apiUrl =
    `${environment.apiUrl}/estudiantes`;

  constructor(
    private http: HttpClient
  ) {}

  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(
      this.apiUrl
    );
  }

  getEstudiante(
    id: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }

  crearEstudiante(
    estudiante: CrearEstudianteRequest
  ): Observable<any> {
    return this.http.post(
      this.apiUrl,
      estudiante
    );
  }

  actualizarEstudiante(
    id: number,
    estudiante: ActualizarEstudianteRequest
  ): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${id}`,
      estudiante
    );
  }

  eliminarEstudiante(
    id: number
  ): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}