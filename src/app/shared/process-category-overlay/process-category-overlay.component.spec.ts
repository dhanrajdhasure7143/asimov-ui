import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessCategoryOverlayComponent } from './process-category-overlay.component';

describe('ProcessCategoryOverlayComponent', () => {
  let component: ProcessCategoryOverlayComponent;
  let fixture: ComponentFixture<ProcessCategoryOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessCategoryOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessCategoryOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
