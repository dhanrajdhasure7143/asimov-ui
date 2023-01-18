import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RpaToolsetComponent } from './rpa-toolset.component';

describe('RpaToolsetComponent', () => {
  let component: RpaToolsetComponent;
  let fixture: ComponentFixture<RpaToolsetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaToolsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaToolsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
