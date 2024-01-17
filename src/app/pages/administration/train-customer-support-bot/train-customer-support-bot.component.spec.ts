import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainCustomerSupportBotComponent } from './train-customer-support-bot.component';

describe('TrainCustomerSupportBotComponent', () => {
  let component: TrainCustomerSupportBotComponent;
  let fixture: ComponentFixture<TrainCustomerSupportBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainCustomerSupportBotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainCustomerSupportBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
