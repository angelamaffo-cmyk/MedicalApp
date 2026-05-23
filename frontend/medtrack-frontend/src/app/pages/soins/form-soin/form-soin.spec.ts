import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSoin } from './form-soin';

describe('FormSoin', () => {
  let component: FormSoin;
  let fixture: ComponentFixture<FormSoin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSoin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSoin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
