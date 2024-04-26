import { TestBed } from '@angular/core/testing';

import { PredefinedBotsService } from './predefined-bots.service';

describe('PredefinedBotsService', () => {
  let service: PredefinedBotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredefinedBotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
