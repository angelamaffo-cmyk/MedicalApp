import { AuthRoleService } from './auth-role.service';
import { TestBed } from '@angular/core/testing';


describe('AuthRole', () => {
  let service: AuthRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
