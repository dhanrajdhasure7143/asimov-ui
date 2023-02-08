import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectTaskDetailsComponent } from './project-task-details.component';

describe('TaskDetailsComponent', () => {
  let component: ProjectTaskDetailsComponent;
  let fixture: ComponentFixture<ProjectTaskDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectTaskDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
