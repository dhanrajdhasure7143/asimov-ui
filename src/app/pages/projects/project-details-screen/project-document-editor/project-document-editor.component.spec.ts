import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDocumentEditorComponent } from './project-document-editor.component';

describe('ProjectDocumentEditorComponent', () => {
  let component: ProjectDocumentEditorComponent;
  let fixture: ComponentFixture<ProjectDocumentEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDocumentEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDocumentEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
