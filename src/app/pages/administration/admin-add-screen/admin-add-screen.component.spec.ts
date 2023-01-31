import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddScreenComponent } from './admin-add-screen.component';

describe('AdminAddScreenComponent', () => {
  let component: AdminAddScreenComponent;
  let fixture: ComponentFixture<AdminAddScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAddScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
