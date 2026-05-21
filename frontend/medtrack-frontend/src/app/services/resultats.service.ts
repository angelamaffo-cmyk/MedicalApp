import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Resultat } from '../models/resultats.model';
@Injectable({
  providedIn: 'root',
})
export class ResultatsService {
  private apiUrl = `${environment.apiUrl}/resultats`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Resultat[]> {
    return this.http.get<Resultat[]>(`${this.apiUrl}/`);
  }
  getOne(id: number): Observable<Resultat> {
    return this.http.get<Resultat>(`${this.apiUrl}/${id}/`);
  }

  create(data: Resultat): Observable<Resultat> {
    return this.http.post<Resultat>(`${this.apiUrl}/`, data);
  }
  update(id: number, data: Resultat): Observable<Resultat> {
    return this.http.put<Resultat>(`${this.apiUrl}/${id}/`, data);
  }
  getByExamen(examenId: number): Observable<Resultat[]> {
  return this.http.get<Resultat[]>(`${this.apiUrl}/?examen=${examenId}`);
}

  toggleStatut(id: number, est_actif: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/`, { est_actif });
  }
}
