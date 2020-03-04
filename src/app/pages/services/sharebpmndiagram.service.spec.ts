import { TestBed } from '@angular/core/testing';

import { SharebpmndiagramService } from './sharebpmndiagram.service';

describe('SharebpmndiagramService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharebpmndiagramService = TestBed.get(SharebpmndiagramService);
    expect(service).toBeTruthy();
  });
});
