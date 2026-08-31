import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface UsuarioDisponible {
  idUsuario: number;
  username: string;
}

export interface CrearUsuarioRequest {
  username: string;
  password: string;
  idRol: number;
  idEstado: number;
}

export interface CrearUsuarioResponse {
  idUsuario: number;
  username: string;

  rol: {
    idCatalogoDetalle: number;
    nombre: string;
  };

  estado: {
    idCatalogoDetalle: number;
    nombre: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly apiUrl =
    `${environment.apiUrl}/usuarios`;

  constructor(
    private http: HttpClient
  ) {}

  getDisponiblesEstudiantes():
    Observable<UsuarioDisponible[]> {

    return this.http.get<UsuarioDisponible[]>(
      `${this.apiUrl}/disponibles-estudiantes`
    );
  }

  crearUsuario(
    usuario: CrearUsuarioRequest
  ): Observable<CrearUsuarioResponse> {

    return this.http.post<CrearUsuarioResponse>(
      this.apiUrl,
      usuario
    );
  }
}