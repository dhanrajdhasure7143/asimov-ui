import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDetailsScreenComponent } from './project-details-screen.component';


describe('ProjectDetailsComponent', () => {
  let component: ProjectDetailsScreenComponent;
  let fixture: ComponentFixture<ProjectDetailsScreenComponent>;

  beforeEach(async(() => {
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
