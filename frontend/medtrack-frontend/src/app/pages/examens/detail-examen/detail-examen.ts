import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ExamenService } from '../../../services/examen.service';
import { Examen } from '../../../models/examens.model';

@Component({
  selector: 'app-detail-examen',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-examen.html',
  styleUrl: './detail-examen.css'
})
export class DetailExamenComponent implements OnInit {
  examen: Examen | null = null;
  isLoading = false;
  examenId!: number;
  confirmToggle = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private examenService: ExamenService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.examenId = Number(id);
      this.chargerExamen();
    }
  }

  chargerExamen(): void {
    this.isLoading = true;
    this.examenService.getOne(this.examenId).subscribe({
      next: (data) => {
        this.examen = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger l\'examen.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleStatut(): void {
    if (!this.examen) return;
    const newStatut = !this.examen.est_actif;
    this.examenService.toggleStatut(this.examenId, newStatut).subscribe({
      next: (data) => {
        this.examen!.est_actif = data.est_actif;
        this.successMessage = newStatut ? 'Examen activé !' : 'Examen désactivé !';
        this.confirmToggle = false;
        this.cdr.detectChanges();
        setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: () => {
        this.errorMessage = 'Erreur lors du changement de statut.';
        this.confirmToggle = false;
        this.cdr.detectChanges();
      }
    });
  }
}