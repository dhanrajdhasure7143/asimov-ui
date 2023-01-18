import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RpaCredentialFormComponent } from './rpa-credential-form.component';

describe('RpaCredentialFormComponent', () => {
  let component: RpaCredentialFormComponent;
  let fixture: ComponentFixture<RpaCredentialFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RpaCredentialFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpaCredentialFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
