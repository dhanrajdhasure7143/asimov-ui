import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RpaCredentialsComponent } from './rpa-credentials.component';

describe('RpaCredentialsComponent', () => {
  let component: RpaCredentialsComponent;
  let fixture: ComponentFixture<RpaCredentialsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
