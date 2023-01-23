import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadProcessModelComponent } from './upload-process-model.component';

describe('UploadProcessModelComponent', () => {
  let component: UploadProcessModelComponent;
  let fixture: ComponentFixture<UploadProcessModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadProcessModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProcessModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
