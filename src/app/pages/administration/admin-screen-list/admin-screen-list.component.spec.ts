import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminScreenListComponent } from './admin-screen-list.component';

describe('AdminScreenListComponent', () => {
  let component: AdminScreenListComponent;
  let fixture: ComponentFixture<AdminScreenListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminScreenListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminScreenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
