import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCreateDropBpmnComponent } from './upload-create-drop-bpmn.component';

describe('UploadCreateDropBpmnComponent', () => {
  let component: UploadCreateDropBpmnComponent;
  let fixture: ComponentFixture<UploadCreateDropBpmnComponent>;

  beforeEach(async(() => {
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
