import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Catedratico {
  idCatedratico: number;
  nombre: string;
  apellido: string;

  estado?: {
    idCatalogoDetalle: number;
    nombre: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CatedraticoService {

  private readonly apiUrl =
    `${environment.apiUrl}/catedraticos`;

  constructor(
    private http: HttpClient
  ) {}

  getCatedraticos():
    Observable<Catedratico[]> {

    return this.http.get<Catedratico[]>(
      this.apiUrl
    );
  }
}