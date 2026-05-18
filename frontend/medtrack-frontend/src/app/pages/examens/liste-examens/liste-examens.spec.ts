import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeExamensComponent } from './liste-examens';

describe('ListeExamens', () => {
  let component: ListeExamensComponent;
  let fixture: ComponentFixture<ListeExamensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeExamensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeExamensComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
