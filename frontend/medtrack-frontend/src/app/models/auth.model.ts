export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface Profil {
  id: number;
  username: string;
  email: string;
  nom_complet: string;
  role: string;
  telephone: string;
  specialite: string;
  premiere_connexion: boolean;
  est_actif: boolean;
}