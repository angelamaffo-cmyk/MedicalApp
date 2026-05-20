import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Patients } from '../models/patients.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Liste patients
  getPatients(): Observable<Patients[]> {
    return this.http.get<Patients[]>(`${this.apiUrl}/patients/`);
  }

  // Détail patient
  getPatient(id: number): Observable<Patients> {
    return this.http.get<Patients>(`${this.apiUrl}/patients/${id}/`);
  }

  // Création
  createPatient(patient: Patients): Observable<Patients> {
    return this.http.post<Patients>(`${this.apiUrl}/patients/`, patient);
  }

  // Modification
  updatePatient(id: number, patient: Patients): Observable<Patients> {
    return this.http.put<Patients>(`${this.apiUrl}/patients/${id}/`, patient);
  }

  // Suppression
  desactiverPatient(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/patients/${id}/`, {est_actif: false});
  }
  activerPatient(id:number): Observable<any>{
    return this.http.patch(`${this.apiUrl}/patients/${id}/`, {est_actif:true})
  }
}