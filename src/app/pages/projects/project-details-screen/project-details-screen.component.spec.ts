import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProjectDetailsScreenComponent } from './project-details-screen.component';


describe('ProjectDetailsComponent', () => {
  let component: ProjectDetailsScreenComponent;
  let fixture: ComponentFixture<ProjectDetailsScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectDetailsScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDetailsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
