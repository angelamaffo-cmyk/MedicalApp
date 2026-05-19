import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailResultatComponent } from './detail-resultat';

describe('DetailResultat', () => {
  let component: DetailResultatComponent;
  let fixture: ComponentFixture<DetailResultatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailResultatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailResultatComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
