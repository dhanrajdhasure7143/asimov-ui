import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestFileComponent } from './request-file.component';

describe('RequestFileComponent', () => {
  let component: RequestFileComponent;
  let fixture: ComponentFixture<RequestFileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
