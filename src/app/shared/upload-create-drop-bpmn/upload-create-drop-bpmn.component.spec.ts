import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UploadCreateDropBpmnComponent } from './upload-create-drop-bpmn.component';

describe('UploadCreateDropBpmnComponent', () => {
  let component: UploadCreateDropBpmnComponent;
  let fixture: ComponentFixture<UploadCreateDropBpmnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadCreateDropBpmnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCreateDropBpmnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
