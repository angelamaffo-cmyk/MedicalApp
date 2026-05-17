import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangerMotDePasseComponent } from './changer-mot-de-passe';

describe('ChangerMotDePasse', () => {
  let component: ChangerMotDePasseComponent;
  let fixture: ComponentFixture<ChangerMotDePasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangerMotDePasseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangerMotDePasseComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
