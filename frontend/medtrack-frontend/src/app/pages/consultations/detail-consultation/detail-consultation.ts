import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ConsultationService } from '../../../services/consultation.service';
import { Consultation } from '../../../models/consultations.model';


@Component({
  selector: 'app-detail-consultation',
  standalone:true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-consultation.html',
  styleUrl: './detail-consultation.css',
})
export class DetailConsultationComponent implements OnInit {
  consultation: Consultation | null = null;
  isLoading = false;
  consultationId!: number ;
  confirmToggle = false;
  successMessage = '';
    errorMessage = '';


  constructor(
    private route: ActivatedRoute,
     private consultationService: ConsultationService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.consultationId = Number(id);
      this.chargerConsultation();
    }
  }

  chargerConsultation(): void {
    this.isLoading = true;
    this.consultationService.getOne(this.consultationId).subscribe({
      next: (data) => {
        this.consultation = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
        error: () => {
        this.errorMessage = 'Impossible de charger la consultation.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

    

  toggleStatut(): void {
    if (!this.consultation) return;
    const newStatut = !this.consultation.est_actif;
    this.consultationService.toggleStatut(this.consultationId, newStatut).subscribe({
      next: (data) => {
        this.consultation!.est_actif = data.est_actif;
        this.successMessage = newStatut ? 'Consultation activée !' : 'Consultation désactivée !';
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
