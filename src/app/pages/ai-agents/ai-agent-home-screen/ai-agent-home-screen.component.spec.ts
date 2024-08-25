import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAgentHomeScreenComponent } from './ai-agent-home-screen.component';

describe('AiAgentHomeScreenComponent', () => {
  let component: AiAgentHomeScreenComponent;
  let fixture: ComponentFixture<AiAgentHomeScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiAgentHomeScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiAgentHomeScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
