import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateProjectFormComponent } from './create-project-form.component';

describe('CreateProjectFormComponent', () => {
  let component: CreateProjectFormComponent;
  let fixture: ComponentFixture<CreateProjectFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProjectFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
