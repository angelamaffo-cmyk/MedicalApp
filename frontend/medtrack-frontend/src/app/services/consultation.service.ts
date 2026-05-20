import { Consultation } from '../models/consultations.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ConsultationService {
  private apiUrl = `${environment.apiUrl}/consultations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/`);
  }

  getOne(id: number): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.apiUrl}/${id}/`);
  }
  create(data: Consultation): Observable<Consultation> {
    return this.http.post<Consultation>(`${this.apiUrl}/`, data);
  }

  update(id: number, data: Consultation): Observable<Consultation> {
    return this.http.put<Consultation>(`${this.apiUrl}/${id}/`, data);
  }

  toggleStatut(id: number, est_actif: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/`, { est_actif });
  }
}
