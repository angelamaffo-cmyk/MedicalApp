import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Examen } from '../../../models/examens.model';
import { ExamenService } from '../../../services/examen.service';

@Component({
  selector: 'app-liste-examens',
  standalone:true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './liste-examens.html',
  styleUrl: './liste-examens.css',
})
export class ListeExamensComponent implements OnInit{
  examens: Examen[] = [];
  examensFiltres: Examen[] = [];
  recherche = '';
  isLoading = false;
   errorMessage = '';
   typeColors: any = {
    'BIOLOGIE': 'primary',
    'RADIOLOGIE': 'warning',
    'ECHOGRAPHIE': 'info',
    'SCANNER': 'danger',
    'IRM': 'purple',
    'ECG': 'success',
    'AUTRE': 'secondary',
  };
  constructor(
    private examenService: ExamenService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.chargerExamens();
  }

  chargerExamens(): void {
    this.isLoading = true;
    this.examenService.getAll().subscribe({
      next: (data) => {
        this.examens = data;
        this.examensFiltres = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
         error: () => {
        this.errorMessage = 'Erreur lors du chargement.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  get total(): number { return this.examens.length; }
  get enAttente(): number { return this.examens.filter(e => !e.date_realisation).length; }

    filtrer(): void {
    if(!this.recherche.trim()){
      this.examensFiltres=this.examens;
      return;
    }
    const terme = this.recherche.toLowerCase().trim();
    this.examensFiltres = this.examens.filter(e =>
      e.patient_nom?.toLowerCase().includes(terme) ||
      e.patient_prenom?.toLowerCase().includes(terme) ||
      e.nom_examen.toLowerCase().includes(terme) ||
      e.type_examen.toLowerCase().includes(terme)
    );
  }
  reinitialiser(): void {
    this.recherche = '';
    this.examensFiltres = this.examens;
  }
  
   getTypeColor(type: string): string {
    return this.typeColors[type] || 'secondary';
  }
}
