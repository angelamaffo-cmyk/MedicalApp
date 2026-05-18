import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeConsultationsComponent } from './liste-consultations';

describe('ListeConsultations', () => {
  let component: ListeConsultationsComponent;
  let fixture: ComponentFixture<ListeConsultationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeConsultationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeConsultationsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
