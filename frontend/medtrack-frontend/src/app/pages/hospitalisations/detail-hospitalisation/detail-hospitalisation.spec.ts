import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailHospitalisationComponent } from './detail-hospitalisation';

describe('DetailHospitalisation', () => {
  let component: DetailHospitalisationComponent;
  let fixture: ComponentFixture<DetailHospitalisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailHospitalisationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailHospitalisationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
