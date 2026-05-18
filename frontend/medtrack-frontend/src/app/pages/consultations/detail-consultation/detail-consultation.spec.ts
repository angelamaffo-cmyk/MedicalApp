import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailConsultationComponent } from './detail-consultation';

describe('DetailConsultation', () => {
  let component: DetailConsultationComponent;
  let fixture: ComponentFixture<DetailConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailConsultationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailConsultationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
