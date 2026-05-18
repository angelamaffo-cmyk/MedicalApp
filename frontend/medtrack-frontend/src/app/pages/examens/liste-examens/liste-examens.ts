import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Examen {
  id: number;
  patient_nom: string;
  patient_prenom: string;
  nom_examen: string;
  type_examen: string;
  date_prescription: string;
  date_realisation: string | null;
  laboratoire: string;
  est_actif: boolean;
  a_resultat: boolean;
}
@Component({
  selector: 'app-liste-examens',
  standalone:true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './liste-examens.html',
  styleUrl: './liste-examens.css',
})
export class ListeExamensComponent {
  examens: Examen[] = [
    { id: 1, patient_nom: 'Temgoua', patient_prenom: 'Belmisse', nom_examen: 'Numération Formule Sanguine', type_examen: 'BIOLOGIE', date_prescription: '2026-05-18', date_realisation: '2026-05-19', laboratoire: 'Labo Central', est_actif: true, a_resultat: true },
    { id: 2, patient_nom: 'Kamga', patient_prenom: 'Jean', nom_examen: 'Radiographie Thorax', type_examen: 'RADIOLOGIE', date_prescription: '2026-05-17', date_realisation: null, laboratoire: 'Imagerie Médicale', est_actif: true, a_resultat: false },
    { id: 3, patient_nom: 'Tchoupo', patient_prenom: 'Marie', nom_examen: 'Échographie Abdominale', type_examen: 'ECHOGRAPHIE', date_prescription: '2026-05-16', date_realisation: '2026-05-17', laboratoire: 'Centre Médical', est_actif: true, a_resultat: false },
  ];
  examensFiltres: Examen[] = [];
  recherche = '';
  isLoading = false;
   typeColors: any = {
    'BIOLOGIE': 'primary',
    'RADIOLOGIE': 'warning',
    'ECHOGRAPHIE': 'info',
    'SCANNER': 'danger',
    'IRM': 'purple',
    'ECG': 'success',
    'AUTRE': 'secondary',
  };
  ngOnInit(): void {
    this.examensFiltres = this.examens;
  }
    filtrer(): void {
    const terme = this.recherche.toLowerCase();
    this.examensFiltres = this.examens.filter(e =>
      e.patient_nom.toLowerCase().includes(terme) ||
      e.patient_prenom.toLowerCase().includes(terme) ||
      e.nom_examen.toLowerCase().includes(terme) ||
      e.type_examen.toLowerCase().includes(terme)
    );
  }
   getTypeColor(type: string): string {
    return this.typeColors[type] || 'secondary';
  }
}
