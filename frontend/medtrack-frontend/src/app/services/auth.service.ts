import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, Profil } from '../models/auth.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login/`, credentials).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('profil');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  refreshToken(): Observable<LoginResponse> {
    const refresh = this.getRefreshToken();
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/refresh/`, { refresh }).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access);
      })
    );
  }

  getMonProfil(): Observable<Profil> {
    return this.http.get<Profil>(`${this.apiUrl}/comptes/mon-profil/`).pipe(
      tap(profil => {
        localStorage.setItem('profil', JSON.stringify(profil));
      })
    );
  }

  getProfilLocal(): Profil | null {
    const profil = localStorage.getItem('profil');
    return profil ? JSON.parse(profil) : null;
  }

  estMedecin(): boolean {
    const profil = this.getProfilLocal();
    return profil?.role === 'MEDECIN';
  }

  estInfirmier(): boolean {
    const profil = this.getProfilLocal();
    return profil?.role === 'INFIRMIER';
  }

  premiereConnexion(): boolean {
    const profil = this.getProfilLocal();
    return profil?.premiere_connexion === true;
  }
}
