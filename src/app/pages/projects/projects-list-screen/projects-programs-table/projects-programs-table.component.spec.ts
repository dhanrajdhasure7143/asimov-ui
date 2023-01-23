import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectsProgramsTableComponent } from './projects-programs-table.component';

describe('ProjectsProgramsTableComponent', () => {
  let component: ProjectsProgramsTableComponent;
  let fixture: ComponentFixture<ProjectsProgramsTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsProgramsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsProgramsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
