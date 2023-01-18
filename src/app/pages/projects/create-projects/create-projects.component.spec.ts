import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateProjectsComponent } from './create-projects.component';

describe('CreateProjectsComponent', () => {
  let component: CreateProjectsComponent;
  let fixture: ComponentFixture<CreateProjectsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
