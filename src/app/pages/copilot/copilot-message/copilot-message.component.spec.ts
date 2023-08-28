import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopilotMessageComponent } from './copilot-message.component';

describe('CopilotMessageComponent', () => {
  let component: CopilotMessageComponent;
  let fixture: ComponentFixture<CopilotMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopilotMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
