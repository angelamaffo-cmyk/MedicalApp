import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHospitalisationComponent } from './form-hospitalisation';

describe('FormHospitalisation', () => {
  let component: FormHospitalisationComponent;
  let fixture: ComponentFixture<FormHospitalisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormHospitalisationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormHospitalisationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
