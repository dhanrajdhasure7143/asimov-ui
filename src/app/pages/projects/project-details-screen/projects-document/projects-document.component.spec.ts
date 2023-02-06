import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsDocumentComponent } from './projects-document.component';

describe('ProjectsDocumentComponent', () => {
  let component: ProjectsDocumentComponent;
  let fixture: ComponentFixture<ProjectsDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
