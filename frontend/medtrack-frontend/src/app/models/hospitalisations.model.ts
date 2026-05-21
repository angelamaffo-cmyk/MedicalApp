export interface Observation {
  id?: number;
  hospitalisation: number;
  auteur?: number;
  auteur_nom?: string;
  contenu: string;
  date_observation?: string;
}

export interface Hospitalisation {
  id?: number;
  patient: number;
  patient_nom?: string;
  patient_prenom?: string;
  lit: number;
  lit_numero?: string;
  service_nom?: string;
  medecin_responsable?: number;
  medecin_nom?: string;
  date_entree: string;
  date_sortie?: string;
  motif_admission: string;
  statut: string;
  motif_sortie?: string;
  observations?: Observation[];
  date_creation?: string;
  date_modification?: string;
}

export interface Lit {
  id: number;
  numero: string;
  service: number;
  service_nom: string;
  statut: string;
  
}