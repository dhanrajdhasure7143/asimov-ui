import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SoEnvironmentsComponent } from './so-environments.component';

describe('SoEnvironmentsComponent', () => {
  let component: SoEnvironmentsComponent;
  let fixture: ComponentFixture<SoEnvironmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SoEnvironmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoEnvironmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
