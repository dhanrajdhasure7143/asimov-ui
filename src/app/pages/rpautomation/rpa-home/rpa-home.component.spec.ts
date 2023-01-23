import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RpaHomeComponent } from './rpa-home.component';

describe('RpaHomeComponent', () => {
  let component: RpaHomeComponent;
  let fixture: ComponentFixture<RpaHomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
