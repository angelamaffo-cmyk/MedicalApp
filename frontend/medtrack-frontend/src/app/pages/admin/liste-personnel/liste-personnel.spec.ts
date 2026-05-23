import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePersonnel } from './liste-personnel';

describe('ListePersonnel', () => {
  let component: ListePersonnel;
  let fixture: ComponentFixture<ListePersonnel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListePersonnel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListePersonnel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
