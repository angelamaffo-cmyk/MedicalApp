import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePatientsComponent } from './liste-patients';

describe('ListePatients', () => {
  let component: ListePatientsComponent;
  let fixture: ComponentFixture<ListePatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListePatientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListePatientsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
