import { TestBed } from '@angular/core/testing';

import { Assignation } from './assignation';

describe('Assignation', () => {
  let service: Assignation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Assignation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
