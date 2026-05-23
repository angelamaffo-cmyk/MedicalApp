import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthRoleService } from '../services/auth-role.service';



export const medecinGuard: CanActivateFn = () => {
  const roleService = inject(AuthRoleService);
  const router = inject(Router);

  if (roleService.isMedecin()) return true;

  router.navigate(['/dashboard']);
  return false;
};
