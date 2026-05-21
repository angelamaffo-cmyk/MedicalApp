import { Hospitalisation,Observation } from './../models/hospitalisations.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HospitalisationsService {
  private apiUrl = `${environment.apiUrl}/hospitalisations`;
  private obsUrl = `${environment.apiUrl}/observations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Hospitalisation[]> {
    return this.http.get<Hospitalisation[]>(`${this.apiUrl}/`);
  }
  getOne(id: number): Observable<Hospitalisation> {
    return this.http.get<Hospitalisation>(`${this.apiUrl}/${id}/`);
  }

  create(data: Hospitalisation): Observable<Hospitalisation> {
    return this.http.post<Hospitalisation>(`${this.apiUrl}/`, data);
  }

  update(id: number, data: Hospitalisation): Observable<Hospitalisation> {
    return this.http.put<Hospitalisation>(`${this.apiUrl}/${id}/`, data);
  }
  ajouterObservation(data: Observation): Observable<Observation> {
    return this.http.post<Observation>(`${this.obsUrl}/`, data);
  }

  getEnCours(): Observable<Hospitalisation[]> {
    return this.http.get<Hospitalisation[]>(`${this.apiUrl}/en_cours/`);
  }
}
