import { TestBed } from '@angular/core/testing';

import { EnvironmentsService } from './environments.service';

describe('EnvironmentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnvironmentsService = TestBed.get(EnvironmentsService);
    expect(service).toBeTruthy();
  });
});
