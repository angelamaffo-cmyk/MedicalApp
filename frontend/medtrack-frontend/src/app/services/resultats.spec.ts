import { TestBed } from '@angular/core/testing';

import { Resultats } from './resultats';

describe('Resultats', () => {
  let service: Resultats;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Resultats);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
