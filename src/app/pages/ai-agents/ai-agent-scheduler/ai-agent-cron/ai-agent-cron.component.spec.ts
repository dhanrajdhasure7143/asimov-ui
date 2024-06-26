import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAgentCronComponent } from './ai-agent-cron.component';

describe('AiAgentCronComponent', () => {
  let component: AiAgentCronComponent;
  let fixture: ComponentFixture<AiAgentCronComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiAgentCronComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiAgentCronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
