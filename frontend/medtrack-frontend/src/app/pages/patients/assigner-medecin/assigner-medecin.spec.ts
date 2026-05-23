import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignerMedecin } from './assigner-medecin';

describe('AssignerMedecin', () => {
  let component: AssignerMedecin;
  let fixture: ComponentFixture<AssignerMedecin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignerMedecin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignerMedecin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
