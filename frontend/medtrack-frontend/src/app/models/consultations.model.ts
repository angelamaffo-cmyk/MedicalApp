export interface Consultation {
  id?: number;
  patient: number;
  patient_nom?: string;
  patient_prenom?: string;
  date_consultation: string;
  motif: string;
  diagnostic: string;
  traitement?: string;
  observations?: string;
  est_actif?: boolean;
  date_creation?: string;
  date_modification?: string;
}