import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BacklogsListComponent } from './backlogs-list.component';

describe('BacklogsListComponent', () => {
  let component: BacklogsListComponent;
  let fixture: ComponentFixture<BacklogsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BacklogsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BacklogsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
