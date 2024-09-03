import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAgentMarketingComponent } from './ai-agent-marketing.component';

describe('AiAgentMarketingComponent', () => {
  let component: AiAgentMarketingComponent;
  let fixture: ComponentFixture<AiAgentMarketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiAgentMarketingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiAgentMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
