import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedBotsOrchestrationComponent } from './predefined-bots-orchestration.component';

describe('PredefinedBotsOrchestrationComponent', () => {
  let component: PredefinedBotsOrchestrationComponent;
  let fixture: ComponentFixture<PredefinedBotsOrchestrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredefinedBotsOrchestrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedBotsOrchestrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
