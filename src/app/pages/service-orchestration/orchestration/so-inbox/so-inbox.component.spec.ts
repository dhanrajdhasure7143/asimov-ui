import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SoInboxComponent } from './so-inbox.component';

describe('SoInboxComponent', () => {
  let component: SoInboxComponent;
  let fixture: ComponentFixture<SoInboxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SoInboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
