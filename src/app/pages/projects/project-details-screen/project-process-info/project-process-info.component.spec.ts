import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectProcessInfoComponent } from './project-process-info.component';

describe('ProjectProcessInfoComponent', () => {
  let component: ProjectProcessInfoComponent;
  let fixture: ComponentFixture<ProjectProcessInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectProcessInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectProcessInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
