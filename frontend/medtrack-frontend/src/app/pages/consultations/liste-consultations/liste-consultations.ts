import { Component , OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConsultationService} from '../../../services/consultation.service';
import { Consultation } from '../../../models/consultations.model';

@Component({
  selector: 'app-liste-consultations',
  standalone:true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './liste-consultations.html',
  styleUrl: './liste-consultations.css',
})
export class ListeConsultationsComponent implements OnInit {
consultations: Consultation[] = [];
    
  consultationsFiltrees: Consultation[] = [];
  recherche = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private consultationService: ConsultationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerConsultations();
  }
  chargerConsultations(): void {
    this.isLoading=true;
    this.consultationService.getAll().subscribe({
      next:(data)=>{
        this.consultations=data;
        this.consultationsFiltrees=data;
        this.isLoading=false;
        this.cdr.detectChanges();
      },
      error:(err)=>{
        console.error(err);
        this.errorMessage='Erreur lors du chargement';
        this.isLoading=false;
        this.cdr.detectChanges();
      }
    });

  }
  get total(): number { return this.consultations.length; }
  get totalActives(): number { return this.consultations.filter(c => c.est_actif).length; }

  filtrer(): void {
    if (!this.recherche.trim()) {
      this.consultationsFiltrees = this.consultations;
      return;
    }
    const terme = this.recherche.toLowerCase().trim();
    this.consultationsFiltrees = this.consultations.filter(c =>
      c.patient_nom?.toLowerCase().includes(terme) ||
      c.patient_prenom?.toLowerCase().includes(terme) ||
      c.motif.toLowerCase().includes(terme) ||
      c.diagnostic.toLowerCase().includes(terme)
    );
  }
  reinitialiser(): void {
    this.recherche = '';
    this.consultationsFiltrees = this.consultations;
  }
}
