import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedBotsLogsComponent } from './predefined-bots-logs.component';

describe('PredefinedBotsLogsComponent', () => {
  let component: PredefinedBotsLogsComponent;
  let fixture: ComponentFixture<PredefinedBotsLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredefinedBotsLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedBotsLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
