import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AssignationInfirmier, AssignationMedecin, Soin } from '../models/assignation.model';

@Injectable({
  providedIn: 'root',
})
export class AssignationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Assignations médecin
  getAssignationsMedecin(): Observable<AssignationMedecin[]> {
    return this.http.get<AssignationMedecin[]>(`${this.apiUrl}/assignations-medecin/`);
  }

  creerAssignationMedecin(data: AssignationMedecin): Observable<AssignationMedecin> {
    return this.http.post<AssignationMedecin>(`${this.apiUrl}/assignations-medecin/`, data);
  }

   // Assignations infirmier
  getAssignationsInfirmier(): Observable<AssignationInfirmier[]> {
    return this.http.get<AssignationInfirmier[]>(`${this.apiUrl}/assignations-infirmier/`);
  }

  creerAssignationInfirmier(data: AssignationInfirmier): Observable<AssignationInfirmier> {
    return this.http.post<AssignationInfirmier>(`${this.apiUrl}/assignations-infirmier/`, data);
  }
   // Soins
  getSoins(): Observable<Soin[]> {
    return this.http.get<Soin[]>(`${this.apiUrl}/soins/`);
  }

  creerSoin(data: Soin): Observable<Soin> {
    return this.http.post<Soin>(`${this.apiUrl}/soins/`, data);
  }
}
