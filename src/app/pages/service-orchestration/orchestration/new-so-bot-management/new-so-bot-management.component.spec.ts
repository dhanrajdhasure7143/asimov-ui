import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSoBotManagementComponent } from './new-so-bot-management.component';

describe('NewSoBotManagementComponent', () => {
  let component: NewSoBotManagementComponent;
  let fixture: ComponentFixture<NewSoBotManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSoBotManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSoBotManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
