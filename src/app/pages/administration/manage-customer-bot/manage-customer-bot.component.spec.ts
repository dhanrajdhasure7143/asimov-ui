import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCustomerBotComponent } from './manage-customer-bot.component';

describe('ManageCustomerBotComponent', () => {
  let component: ManageCustomerBotComponent;
  let fixture: ComponentFixture<ManageCustomerBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCustomerBotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCustomerBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
