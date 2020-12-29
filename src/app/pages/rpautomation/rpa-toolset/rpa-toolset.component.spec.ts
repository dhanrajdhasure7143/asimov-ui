import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaToolsetComponent } from './rpa-toolset.component';

describe('RpaToolsetComponent', () => {
  let component: RpaToolsetComponent;
  let fixture: ComponentFixture<RpaToolsetComponent>;

  beforeEach(async(() => {
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
