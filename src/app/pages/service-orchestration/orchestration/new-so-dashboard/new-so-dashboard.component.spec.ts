import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewSoDashboardComponent } from './new-so-dashboard.component';

describe('NewSoDashboardComponent', () => {
  let component: NewSoDashboardComponent;
  let fixture: ComponentFixture<NewSoDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSoDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
