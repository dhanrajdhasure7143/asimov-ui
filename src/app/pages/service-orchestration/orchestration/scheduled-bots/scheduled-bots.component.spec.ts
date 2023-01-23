import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScheduledBotsComponent } from './scheduled-bots.component';

describe('ScheduledBotsComponent', () => {
  let component: ScheduledBotsComponent;
  let fixture: ComponentFixture<ScheduledBotsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledBotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledBotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
