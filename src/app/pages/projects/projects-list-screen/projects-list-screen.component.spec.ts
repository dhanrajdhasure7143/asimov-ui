import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsListScreenComponent } from './projects-list-screen.component';

describe('ProjectsListScreenComponent', () => {
  let component: ProjectsListScreenComponent;
  let fixture: ComponentFixture<ProjectsListScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsListScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsListScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
