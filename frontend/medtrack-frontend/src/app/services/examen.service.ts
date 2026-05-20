import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Examen } from '../models/examens.model';

@Injectable({
  providedIn: 'root',
})
export class ExamenService {
  private apiUrl = `${environment.apiUrl}/examens`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Examen[]> {
    return this.http.get<Examen[]>(`${this.apiUrl}/`);
  }

  getOne(id: number): Observable<Examen> {
    return this.http.get<Examen>(`${this.apiUrl}/${id}/`);
  }
  create(data: Examen): Observable<Examen> {
    return this.http.post<Examen>(`${this.apiUrl}/`, data);
  }

  update(id: number, data: Examen): Observable<Examen> {
    return this.http.put<Examen>(`${this.apiUrl}/${id}/`, data);
  }

  toggleStatut(id: number, est_actif: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/`, { est_actif });
  }
}
