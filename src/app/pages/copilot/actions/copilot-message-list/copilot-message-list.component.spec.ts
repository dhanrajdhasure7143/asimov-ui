import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopilotMessageListComponent } from './copilot-message-list.component';

describe('CopilotMessageListComponent', () => {
  let component: CopilotMessageListComponent;
  let fixture: ComponentFixture<CopilotMessageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopilotMessageListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotMessageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
