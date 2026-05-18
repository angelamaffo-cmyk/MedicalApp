import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExamenComponent } from './form-examen';

describe('FormExamen', () => {
  let component: FormExamenComponent;
  let fixture: ComponentFixture<FormExamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormExamenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormExamenComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
