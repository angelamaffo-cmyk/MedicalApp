import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerPersonnelComponent } from './creer-personnel';

describe('CreerPersonnel', () => {
  let component: CreerPersonnelComponent;
  let fixture: ComponentFixture<CreerPersonnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerPersonnelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerPersonnelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
