import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeHospitalisationsComponent } from './liste-hospitalisations';

describe('ListeHospitalisations', () => {
  let component: ListeHospitalisationsComponent;
  let fixture: ComponentFixture<ListeHospitalisationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeHospitalisationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeHospitalisationsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
