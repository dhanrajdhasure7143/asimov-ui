import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsProgramsTableComponent } from './projects-programs-table.component';

describe('ProjectsProgramsTableComponent', () => {
  let component: ProjectsProgramsTableComponent;
  let fixture: ComponentFixture<ProjectsProgramsTableComponent>;

  beforeEach(async(() => {
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
