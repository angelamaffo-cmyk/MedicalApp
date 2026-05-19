import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Resultat{
  id: number;
  patient_nom: string;
  patient_prenom: string;
  examen_nom: string;
  examen_type: string;
  date_resultat: string;
  conclusion: string;
  est_normal: boolean;
  est_actif: boolean;
}
@Component({
  selector: 'app-liste-resultats',
  standalone:true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './liste-resultats.html',
  styleUrl: './liste-resultats.css',
})
export class ListeResultatsComponent implements OnInit {
  resultats: Resultat[] = [
    { id: 1, patient_nom: 'Temgoua', patient_prenom: 'Belmisse', examen_nom: 'Numération Formule Sanguine', examen_type: 'BIOLOGIE', date_resultat: '2026-05-19', conclusion: 'Anémie légère détectée', est_normal: false, est_actif: true },
    { id: 2, patient_nom: 'Kamga', patient_prenom: 'Jean', examen_nom: 'Radiographie Thorax', examen_type: 'RADIOLOGIE', date_resultat: '2026-05-18', conclusion: 'Résultat normal', est_normal: true, est_actif: true },
    { id: 3, patient_nom: 'Tchoupo', patient_prenom: 'Marie', examen_nom: 'Échographie Abdominale', examen_type: 'ECHOGRAPHIE', date_resultat: '2026-05-17', conclusion: 'Légère inflammation détectée', est_normal: false, est_actif: true },

  ];
  resultatsFiltres: Resultat[]=[];
  recherche='';
  isLoading=false;

  ngOnInit():void{
    this.resultatsFiltres= this.resultats;
  }

  filtrer(): void{
    const terme = this.recherche.toLocaleLowerCase();
    this.resultatsFiltres=this.resultats.filter(r=>
      r.patient_nom.toLocaleLowerCase().includes(terme) ||
      r.patient_prenom.toLocaleLowerCase().includes(terme)||
      r.examen_nom.toLocaleLowerCase().includes(terme)||
      r.conclusion.toLocaleLowerCase().includes(terme)
    );
  }
}
