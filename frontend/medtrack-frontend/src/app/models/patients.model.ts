export interface Patients {
  id?: number;

  nom: string;
  prenom: string;
  sexe: 'M' | 'F';

  date_naissance: string;

  age?: number;

  telephone: string;
  adresse?: string;

  groupe_sanguin:
    | 'A+'
    | 'A-'
    | 'B+'
    | 'B-'
    | 'AB+'
    | 'AB-'
    | 'O+'
    | 'O-';

  contact_urgence_nom?: string;
  contact_urgence_telephone?: string;

  est_actif?: boolean;

  date_enregistrement?: string;
  date_modification?: string;
}