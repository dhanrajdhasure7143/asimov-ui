import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VcmComponent } from './vcm.component';

describe('VcmComponent', () => {
  let component: VcmComponent;
  let fixture: ComponentFixture<VcmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VcmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
