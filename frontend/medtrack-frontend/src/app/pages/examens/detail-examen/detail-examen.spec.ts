import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailExamenComponent } from './detail-examen';

describe('DetailExamen', () => {
  let component: DetailExamenComponent;
  let fixture: ComponentFixture<DetailExamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailExamenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailExamenComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
