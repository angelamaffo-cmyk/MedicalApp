import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
interface Examen {
  id: number;
  patient_nom: string;
  patient_prenom: string;
  nom_examen: string;
  type_examen: string;
  date_prescription: string;
  date_realisation: string | null;
  laboratoire: string;
  notes: string;
  est_actif: boolean;
  a_resultat: boolean;
}
@Component({
  selector: 'app-detail-examen',
  standalone:true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-examen.html',
  styleUrl: './detail-examen.css',
})
export class DetailExamenComponent implements OnInit {
  examen: Examen | null = null;
  isLoading = false;
  examenId: number | null = null;
  confirmToggle = false;
  successMessage = '';

  constructor(private route: ActivatedRoute) {}
   ngOnInit(): void {
    this.examenId = this.route.snapshot.params['id'];
    this.isLoading = true;
    setTimeout(() => {
      this.examen = {
         id: this.examenId!,
        patient_nom: 'Temgoua',
        patient_prenom: 'Belmisse',
        nom_examen: 'Numération Formule Sanguine',
        type_examen: 'BIOLOGIE',
        date_prescription: '2026-05-18',
        date_realisation: '2026-05-19',
        laboratoire: 'Labo Central',
        notes: 'Résultat urgent — à transmettre rapidement',
        est_actif: true,
        a_resultat: true,
      };
         this.isLoading = false;
    }, 800);
  }
   toggleStatut(): void {
    if (!this.examen) return;
    this.examen.est_actif = !this.examen.est_actif;
    this.successMessage = this.examen.est_actif
      ? 'Examen activé avec succès !'
      : 'Examen désactivé avec succès !';
    this.confirmToggle = false;
    setTimeout(() => this.successMessage = '', 3000);
  }
}
