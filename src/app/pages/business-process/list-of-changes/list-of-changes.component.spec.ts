import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListOfChangesComponent } from './list-of-changes.component';

describe('ListOfChangesComponent', () => {
  let component: ListOfChangesComponent;
  let fixture: ComponentFixture<ListOfChangesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
