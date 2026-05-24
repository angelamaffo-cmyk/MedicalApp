export interface AssignationMedecin{
    id?: number;
  patient: number;
  patient_nom?: string;
  patient_prenom?: string;
  medecin_source?: number;
  medecin_source_nom?: string;
  medecin_cible: number;
  medecin_cible_nom?: string;
  motif: string;
  service?: string;
  date_assignation?: string;
  est_active?: boolean;
}

export interface AssignationInfirmier {
  id?: number;
  patient: number;
  patient_nom?: string;
  patient_prenom?: string;
  medecin?: number;
  medecin_nom?: string;
  infirmier: number;
  infirmier_nom?: string;
  soins_a_faire: string;
  date_debut: string;
  date_fin?: string;
  est_active?: boolean;
  statut_soins?: string;   // ← Ajoute
  statut_label?: string;
  soins?: Soin[];
}

export interface Soin {
  id?: number;
  assignation: number;
  infirmier?: number;
  infirmier_nom?: string;
  description: string;
  observations?: string;
  date_soin?: string;
}