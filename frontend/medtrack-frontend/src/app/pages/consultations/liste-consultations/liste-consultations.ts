import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Consultation{
  id:number;
  patient_nom: string;
  patient_prenom:string;
  date_consultation:string;
  motif:string;
  diagnostic:string;
  traitement:string;
}
@Component({
  selector: 'app-liste-consultations',
  standalone:true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './liste-consultations.html',
  styleUrl: './liste-consultations.css',
})
export class ListeConsultationsComponent implements OnInit {
consultations: Consultation[] = [
    { id: 1, patient_nom: 'Temgoua', patient_prenom: 'Belmisse', date_consultation: '2026-05-18', motif: 'Fièvre persistante', diagnostic: 'Paludisme', traitement: 'Artemether' },
    { id: 2, patient_nom: 'Kamga', patient_prenom: 'Jean', date_consultation: '2026-05-17', motif: 'Douleurs abdominales', diagnostic: 'Gastrite', traitement: 'Oméprazole' },
    { id: 3, patient_nom: 'Tchoupo', patient_prenom: 'Marie', date_consultation: '2026-05-16', motif: 'Toux chronique', diagnostic: 'Bronchite', traitement: 'Amoxicilline' },
  ];
  consultationsFiltrees: Consultation[] = [];
  recherche = '';
  isLoading = false;

  ngOnInit(): void {
    this.consultationsFiltrees = this.consultations;
  }
  filtrer(): void {
    const terme = this.recherche.toLowerCase();
    this.consultationsFiltrees = this.consultations.filter(c =>
      c.patient_nom.toLowerCase().includes(terme) ||
      c.patient_prenom.toLowerCase().includes(terme) ||
      c.motif.toLowerCase().includes(terme) ||
      c.diagnostic.toLowerCase().includes(terme)
    );
  }
}
