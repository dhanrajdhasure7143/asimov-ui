import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BacklogsCreateComponent } from './backlogs-create.component';

describe('BacklogsCreateComponent', () => {
  let component: BacklogsCreateComponent;
  let fixture: ComponentFixture<BacklogsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BacklogsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BacklogsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
