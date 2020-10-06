import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpaenvironmentsComponent } from './rpa-environments.component';

describe('EnvironmentsComponent', () => {
  let component: RpaenvironmentsComponent;
  let fixture: ComponentFixture<RpaenvironmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaenvironmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaenvironmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
