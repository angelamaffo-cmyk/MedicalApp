import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPatient } from './form-patient';

describe('FormPatient', () => {
  let component: FormPatient;
  let fixture: ComponentFixture<FormPatient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPatient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPatient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
