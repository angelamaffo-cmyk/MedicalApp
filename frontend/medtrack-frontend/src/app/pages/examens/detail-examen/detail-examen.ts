import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ExamenService } from '../../../services/examen.service';
import { Examen } from '../../../models/examens.model';
import { ResultatsService } from '../../../services/resultats.service';
import { Resultat } from '../../../models/resultats.model';
import { AuthRoleService } from '../../../services/auth-role.service';
@Component({
  selector: 'app-detail-examen',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-examen.html',
  styleUrl: './detail-examen.css'
})
export class DetailExamenComponent implements OnInit {
  examen: Examen | null = null;
  resultat: Resultat | null = null;
  isLoading = false;
  examenId!: number;
  confirmToggle = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private examenService: ExamenService,
     private resultatService: ResultatsService,
    private cdr: ChangeDetectorRef,
    public roleService:AuthRoleService,
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
        this.chargerResultat();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger l\'examen.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  chargerResultat(): void {
    this.resultatService.getAll().subscribe({
      next: (data) => {
        const r = data.find(res => Number(res.examen) === Number(this.examenId));
        if (r) {
          this.resultat = r;
          if (this.examen) this.examen.a_resultat = true;
        }
        this.cdr.detectChanges();
      }
    });
  }

  
}