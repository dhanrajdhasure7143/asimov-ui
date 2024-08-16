import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAgentHomeComponent } from './ai-agent-home.component';

describe('PredefinedBotsListComponent', () => {
  let component: AiAgentHomeComponent;
  let fixture: ComponentFixture<AiAgentHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiAgentHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiAgentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
