import { TestBed, async, inject } from '@angular/core/testing';

import { BpsDataSaveGuard } from './bps-data-save.guard';

describe('BpsDataSaveGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BpsDataSaveGuard]
    });
  });

  it('should ...', inject([BpsDataSaveGuard], (guard: BpsDataSaveGuard) => {
    expect(guard).toBeTruthy();
  }));
});
