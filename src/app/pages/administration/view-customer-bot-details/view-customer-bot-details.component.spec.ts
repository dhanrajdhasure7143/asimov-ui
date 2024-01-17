import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerBotDetailsComponent } from './view-customer-bot-details.component';

describe('ViewCustomerBotDetailsComponent', () => {
  let component: ViewCustomerBotDetailsComponent;
  let fixture: ComponentFixture<ViewCustomerBotDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCustomerBotDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerBotDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
