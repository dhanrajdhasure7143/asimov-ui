import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestFileComponent } from './request-file.component';

describe('RequestFileComponent', () => {
  let component: RequestFileComponent;
  let fixture: ComponentFixture<RequestFileComponent>;

  beforeEach(async(() => {
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
