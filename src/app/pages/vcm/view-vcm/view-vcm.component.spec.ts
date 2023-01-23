import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewVcmComponent } from './view-vcm.component';

describe('ViewVcmComponent', () => {
  let component: ViewVcmComponent;
  let fixture: ComponentFixture<ViewVcmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewVcmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
