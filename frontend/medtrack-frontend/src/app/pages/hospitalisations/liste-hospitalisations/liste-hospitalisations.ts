import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Hospitalisation{
   id: number;
  patient_nom: string;
  patient_prenom: string;
  service: string;
  lit: string;
  medecin: string;
  date_entree: string;
  date_sortie: string | null;
  motif_admission: string;
  statut: string;
}
@Component({
  selector: 'app-liste-hospitalisations',
  standalone:true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './liste-hospitalisations.html',
  styleUrl: './liste-hospitalisations.css',
})
export class ListeHospitalisationsComponent implements OnInit{
 hospitalisations: Hospitalisation[] = [
    { id: 1, patient_nom: 'Temgoua', patient_prenom: 'Belmisse', service: 'Médecine Interne', lit: 'Lit 05', medecin: 'Dr Kamga', date_entree: '2026-05-15', date_sortie: null, motif_admission: 'Paludisme grave', statut: 'EN_COURS' },
    { id: 2, patient_nom: 'Nguemo', patient_prenom: 'Paul', service: 'Chirurgie', lit: 'Lit 12', medecin: 'Dr Biya', date_entree: '2026-05-10', date_sortie: '2026-05-18', motif_admission: 'Appendicite', statut: 'SORTI' },
    { id: 3, patient_nom: 'Tchoupo', patient_prenom: 'Marie', service: 'Pédiatrie', lit: 'Lit 03', medecin: 'Dr Kamga', date_entree: '2026-05-17', date_sortie: null, motif_admission: 'Bronchite sévère', statut: 'EN_COURS' },
  ];

   hospitalisationsFiltrees: Hospitalisation[] = [];
  recherche = '';
  isLoading = false;

   statutColors: any = {
    'EN_COURS': 'warning',
    'SORTI': 'success',
    'TRANSFERE': 'info',
    'DECEDE': 'danger',
  };

  ngOnInit(): void {
    this.hospitalisationsFiltrees = this.hospitalisations;
  }

    filtrer(): void {
    const terme = this.recherche.toLowerCase();
    this.hospitalisationsFiltrees = this.hospitalisations.filter(h =>
      h.patient_nom.toLowerCase().includes(terme) ||
      h.patient_prenom.toLowerCase().includes(terme) ||
      h.service.toLowerCase().includes(terme) ||
      h.statut.toLowerCase().includes(terme)
    );
  }

  getStatutColor(statut: string): string {
    return this.statutColors[statut] || 'secondary';
  }

    getStatutLabel(statut: string): string {
    const labels: any = {
      'EN_COURS': 'En cours',
      'SORTI': 'Sorti',
      'TRANSFERE': 'Transféré',
      'DECEDE': 'Décédé',
    };
    return labels[statut] || statut;
  }
}
