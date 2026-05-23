import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignerInfirmier } from './assigner-infirmier';

describe('AssignerInfirmier', () => {
  let component: AssignerInfirmier;
  let fixture: ComponentFixture<AssignerInfirmier>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignerInfirmier]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignerInfirmier);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
