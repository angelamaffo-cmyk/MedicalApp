import { Component , OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ResultatsService } from '../../../services/resultats.service';
import { Resultat } from '../../../models/resultats.model';


@Component({
  selector: 'app-liste-resultats',
  standalone:true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './liste-resultats.html',
  styleUrl: './liste-resultats.css',
})
export class ListeResultatsComponent implements OnInit {
  resultats: Resultat[] = [];
   
  resultatsFiltres: Resultat[]=[];
  recherche='';
  isLoading=false;
  errorMessage='';
   constructor(
    private resultatService: ResultatsService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit():void{
    this.chargerResultats();
  }
  chargerResultats(): void {
    this.isLoading = true;
    this.resultatService.getAll().subscribe({
      next: (data) => {
        this.resultats = data;
        this.resultatsFiltres = data;
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
  get total(): number { return this.resultats.length; }
  get normaux(): number { return this.resultats.filter(r => r.est_normal).length; }
  get anormaux(): number { return this.resultats.filter(r => !r.est_normal).length; }

  filtrer(): void{
    if(!this.recherche.trim()){
      this.resultatsFiltres=this.resultats;
      return;
    }
    const terme = this.recherche.toLowerCase().trim();
    this.resultatsFiltres = this.resultats.filter(r =>
      r.patient_nom?.toLowerCase().includes(terme) ||
      r.patient_prenom?.toLowerCase().includes(terme) ||
      r.examen_nom?.toLowerCase().includes(terme) ||
      r.conclusion.toLowerCase().includes(terme)
    );
  }
  reinitialiser(): void {
    this.recherche = '';
    this.resultatsFiltres = this.resultats;
  }
}
