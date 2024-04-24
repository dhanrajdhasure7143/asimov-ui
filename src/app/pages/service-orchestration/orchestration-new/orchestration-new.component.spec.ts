import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrchestrationNewComponent } from './orchestration-new.component';

describe('OrchestrationNewComponent', () => {
  let component: OrchestrationNewComponent;
  let fixture: ComponentFixture<OrchestrationNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrchestrationNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrchestrationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
