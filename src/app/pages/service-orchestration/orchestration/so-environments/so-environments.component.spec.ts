import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoEnvironmentsComponent } from './so-environments.component';

describe('SoEnvironmentsComponent', () => {
  let component: SoEnvironmentsComponent;
  let fixture: ComponentFixture<SoEnvironmentsComponent>;

  beforeEach(async(() => {
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
