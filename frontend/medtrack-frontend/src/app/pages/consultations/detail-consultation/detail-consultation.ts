import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ConsultationService } from '../../../services/consultation.service';
import { Consultation } from '../../../models/consultations.model';
import { ExamenService } from '../../../services/examen.service';
import { Examen } from '../../../models/examens.model';
import { AuthRoleService } from '../../../services/auth-role.service';
@Component({
  selector: 'app-detail-consultation',
  standalone:true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-consultation.html',
  styleUrl: './detail-consultation.css',
})
export class DetailConsultationComponent implements OnInit {
  consultation: Consultation | null = null;
  examens: Examen[] = [];
  isLoading = false;
  consultationId!: number ;
  confirmToggle = false;
  successMessage = '';
    errorMessage = '';


  constructor(
    private route: ActivatedRoute,
     private consultationService: ConsultationService,
     private examenService: ExamenService,
    private cdr: ChangeDetectorRef,
    public roleService:AuthRoleService
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
chargerExamens(): void {
    this.examenService.getAll().subscribe({
      next: (data) => {
        this.examens = data.filter(e =>Number( e.consultation )===Number( this.consultationId));
        this.cdr.detectChanges();
      }
    });
  }
    

  
  
}
