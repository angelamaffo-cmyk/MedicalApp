import { ActivatedRoute, RouterLink , Router} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder,FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-form-resultat',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './form-resultat.html',
  styleUrl: './form-resultat.css',
})
export class FormResultatComponent implements OnInit {
  form: FormGroup;
  isLoading=false;
  isEditMode=false;
  resultatId: number | null=null;
  successMessage='';
  errorMessage='';

  examens=[
      { id: 1, label: 'Belmisse Temgoua — NFS (18/05/2026)' },
    { id: 2, label: 'Jean Kamga — Radiographie Thorax (17/05/2026)' },
    { id: 3, label: 'Marie Tchoupo — Échographie (16/05/2026)' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ){
    this.form=this.fb.group({
      examen: ['', Validators.required],
      date_resultat:['', Validators.required],
      contenu: ['', Validators.required],
      conclusion:['', Validators.required],
      est_normal:[true, Validators.required],
    });
  }

  ngOnInit(): void {
    this.resultatId=this.route.snapshot.params['id'];
    if (this.resultatId){
      this.isEditMode=true;
      this.form.patchValue({
        exam:1,
        date_resultat: '2026-05-19',
        contenu:'Hemoglobine: 10g/dL (normale: 12-16 g/dL)\nGlobules rouges: 3.5 millions/mm³',
        conclusion: 'Anémie légère détectée. Supplémentation en fer recommandée.',
        est_nromal: false,
      });
    }
  }

  get examen() { return this.form.get('examen'); }
  get date_resultat() { return this.form.get('date_resultat'); }
  get contenu() { return this.form.get('contenu'); }
  get conclusion() { return this.form.get('conclusion'); }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = this.isEditMode
        ? 'Résultat modifié avec succès !'
        : 'Résultat enregistré avec succès !';  
          setTimeout(() => this.router.navigate(['/resultats']), 1500);
    }, 1000);  
  }

}
