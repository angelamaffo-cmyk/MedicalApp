import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConsultationComponent } from './form-consultation';

describe('FormConsultation', () => {
  let component: FormConsultationComponent;
  let fixture: ComponentFixture<FormConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormConsultationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormConsultationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
