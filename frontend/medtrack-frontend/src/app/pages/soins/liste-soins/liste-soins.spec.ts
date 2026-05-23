import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeSoins } from './liste-soins';

describe('ListeSoins', () => {
  let component: ListeSoins;
  let fixture: ComponentFixture<ListeSoins>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeSoins]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeSoins);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
