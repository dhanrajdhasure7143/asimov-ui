import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RpaSoLogsComponent } from './rpa-so-logs.component';

describe('RpaSoLogsComponent', () => {
  let component: RpaSoLogsComponent;
  let fixture: ComponentFixture<RpaSoLogsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaSoLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaSoLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
