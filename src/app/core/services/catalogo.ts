import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface CatalogoDetalle {
  idCatalogoDetalle: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  private readonly apiUrl =
    `${environment.apiUrl}/catalogos`;

  constructor(
    private http: HttpClient
  ) {}

  getNiveles(): Observable<CatalogoDetalle[]> {
    return this.http.get<CatalogoDetalle[]>(
      `${this.apiUrl}/niveles`
    );
  }

  getEstados(): Observable<CatalogoDetalle[]> {
    return this.http.get<CatalogoDetalle[]>(
      `${this.apiUrl}/estados`
    );
  }

  getGrados(): Observable<CatalogoDetalle[]> {
    return this.http.get<CatalogoDetalle[]>(
      `${this.apiUrl}/grados`
    );
  }

  getCarreras(): Observable<CatalogoDetalle[]> {
    return this.http.get<CatalogoDetalle[]>(
      `${this.apiUrl}/carreras`
    );
  }

  getRoles(): Observable<CatalogoDetalle[]> {
    return this.http.get<CatalogoDetalle[]>(
      `${this.apiUrl}/roles`
    );
  }
}