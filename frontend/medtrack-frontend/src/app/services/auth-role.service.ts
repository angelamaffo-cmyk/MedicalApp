import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthRoleService {

  constructor(private authService: AuthService) {}

  getProfil(): any {
    return this.authService.getProfilLocal();
  }

  isAdmin(): boolean {
    return !this.getProfil();
  }

  isMedecin(): boolean {
    return this.getProfil()?.role === 'MEDECIN';
  }

  isInfirmier(): boolean {
    return this.getProfil()?.role === 'INFIRMIER';
  }

  isGeneraliste(): boolean {
    return this.isMedecin() && this.getProfil()?.specialite === 'Médecine Générale';
  }

  isSpecialiste(): boolean {
    return this.isMedecin() && this.getProfil()?.specialite !== 'Médecine Générale';
  }

  // Permissions
  peutCreerPatient(): boolean { return this.isGeneraliste(); }
  peutModifierPatient(): boolean { return this.isMedecin(); }
  peutDesactiverPatient(): boolean { return this.isGeneraliste(); }
  peutFaireConsultation(): boolean { return this.isMedecin(); }
  peutFaireExamen(): boolean { return this.isMedecin(); }
  peutFaireResultat(): boolean { return this.isMedecin(); }
  peutAssignerMedecin(): boolean { return this.isGeneraliste(); }
  peutAssignerInfirmier(): boolean { return this.isMedecin(); }
  peutFaireSoins(): boolean { return this.isInfirmier(); }
  peutCreerPersonnel(): boolean { return this.isAdmin(); }
  peutVoirPersonnel(): boolean { return this.isAdmin(); }
}