export interface Resultat {
  id?: number;
  examen: number;
  examen_nom?: string;
  examen_type?: string;
  patient_nom?: string;
  patient_prenom?: string;
  date_resultat: string;
  contenu: string;
  conclusion: string;
  est_normal: boolean;
  est_actif?: boolean;
  date_creation?: string;
  date_modification?: string;
}
