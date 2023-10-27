import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopilotHistoryComponent } from './copilot-history.component';

describe('CopilotHistoryComponent', () => {
  let component: CopilotHistoryComponent;
  let fixture: ComponentFixture<CopilotHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopilotHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
