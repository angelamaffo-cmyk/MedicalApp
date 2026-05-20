import { TestBed } from '@angular/core/testing';

import { Hospitalisations } from './hospitalisations';

describe('Hospitalisations', () => {
  let service: Hospitalisations;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Hospitalisations);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
