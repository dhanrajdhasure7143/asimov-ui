import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateVcmComponent } from './create-vcm.component';

describe('CreateVcmComponent', () => {
  let component: CreateVcmComponent;
  let fixture: ComponentFixture<CreateVcmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVcmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
