import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

interface Resultat{
   id: number;
  patient_nom: string;
  patient_prenom: string;
  examen_nom: string;
  examen_type: string;
  date_resultat: string;
  contenu: string;
  conclusion: string;
  est_normal: boolean;
  est_actif: boolean;
}

@Component({
  selector: 'app-detail-resultat',
  standalone:true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-resultat.html',
  styleUrl: './detail-resultat.css',
})
export class DetailResultatComponent implements OnInit {
  resultat: Resultat | null = null;
  isLoading = false;
  resultatId: number | null = null;
  confirmToggle = false;
  successMessage = '';

  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    this.resultatId = this.route.snapshot.params['id'];
    this.isLoading = true;
    setTimeout(() => {
      this.resultat = {
          id: this.resultatId!,
        patient_nom: 'Maffo',
        patient_prenom: 'Angela',
        examen_nom: 'Numération Formule Sanguine',
        examen_type: 'BIOLOGIE',
        date_resultat: '2026-05-19',
        contenu: 'Hémoglobine : 10g/dL (normale : 12-16 g/dL)\nGlobules rouges : 3.5 millions/mm³\nPlaquettes : 250 000/mm³',
        conclusion: 'Anémie légère détectée. Supplémentation en fer recommandée.',
        est_normal: false,
        est_actif: true,
      };
      this.isLoading=false;
    }, 800);
  }
   toggleStatut(): void {
    if (!this.resultat) return;
    this.resultat.est_actif = !this.resultat.est_actif;
    this.successMessage = this.resultat.est_actif
      ? 'Résultat activé avec succès !'
      : 'Résultat désactivé avec succès !';
    this.confirmToggle = false;
    setTimeout(() => this.successMessage = '', 3000);
  }

}
