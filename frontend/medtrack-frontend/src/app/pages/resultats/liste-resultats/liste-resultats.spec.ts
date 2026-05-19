import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeResultatsComponent } from './liste-resultats';

describe('ListeResultats', () => {
  let component: ListeResultatsComponent;
  let fixture: ComponentFixture<ListeResultatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeResultatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeResultatsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
