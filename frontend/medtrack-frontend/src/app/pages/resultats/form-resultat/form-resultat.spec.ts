import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormResultatComponent } from './form-resultat';

describe('FormResultat', () => {
  let component: FormResultatComponent;
  let fixture: ComponentFixture<FormResultatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormResultatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormResultatComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
