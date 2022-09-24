import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVcmComponent } from './view-vcm.component';

describe('ViewVcmComponent', () => {
  let component: ViewVcmComponent;
  let fixture: ComponentFixture<ViewVcmComponent>;

  beforeEach(async(() => {
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
