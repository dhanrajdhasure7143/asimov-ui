import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRpaDesignComponent } from './project-rpa-design.component';

describe('ProjectRpaDesignComponent', () => {
  let component: ProjectRpaDesignComponent;
  let fixture: ComponentFixture<ProjectRpaDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectRpaDesignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRpaDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
