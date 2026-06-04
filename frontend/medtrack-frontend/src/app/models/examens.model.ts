export interface Examen {
  id?: number;
  consultation: number;
  patient_nom?: string;
  patient_prenom?: string;
  consultation_date?: string;
  type_examen: string;
  nom_examen: string;
  date_prescription: string;
  date_realisation?: string | null ;
  laboratoire?: string;
  notes?: string;
  statut: 'EN_ATTENTE' | 'REALISE' | 'ANNULE'; // <-- Ajout du type ici
  a_resultat?: boolean;  // ← Ajoute cette ligne
  date_creation?: string;
}