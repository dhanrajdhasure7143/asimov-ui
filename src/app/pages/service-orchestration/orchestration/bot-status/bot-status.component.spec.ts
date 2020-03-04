import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BotStatusComponent } from './bot-status.component';

describe('BotStatusComponent', () => {
  let component: BotStatusComponent;
  let fixture: ComponentFixture<BotStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BotStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
