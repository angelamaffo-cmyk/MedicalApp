import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthRoleService } from '../services/auth-role.service';
export const adminGuard: CanActivateFn = () => {
  const roleService=inject(AuthRoleService);
  const router=inject(Router);

  if (roleService.isAdmin()) return true;
  router.navigate(['/dashboard']);

  return false;
};
