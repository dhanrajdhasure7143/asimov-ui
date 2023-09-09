import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopilotMessageButtonComponent } from './copilot-message-button.component';

describe('CopilotMessageButtonComponent', () => {
  let component: CopilotMessageButtonComponent;
  let fixture: ComponentFixture<CopilotMessageButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopilotMessageButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotMessageButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
