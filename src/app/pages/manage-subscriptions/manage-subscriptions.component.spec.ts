import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageSubscriptionsComponent } from './manage-subscriptions.component';

describe('ManageSubscriptionsComponent', () => {
  let component: ManageSubscriptionsComponent;
  let fixture: ComponentFixture<ManageSubscriptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSubscriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
