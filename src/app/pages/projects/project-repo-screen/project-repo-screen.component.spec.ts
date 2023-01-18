import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectRepoScreenComponent } from './project-repo-screen.component';

describe('ProjectRepoScreenComponent', () => {
  let component: ProjectRepoScreenComponent;
  let fixture: ComponentFixture<ProjectRepoScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectRepoScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRepoScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
