import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscrptionComponent } from './subscrption.component';

describe('SubscrptionComponent', () => {
  let component: SubscrptionComponent;
  let fixture: ComponentFixture<SubscrptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscrptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscrptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
