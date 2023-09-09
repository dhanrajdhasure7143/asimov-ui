import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserManagementComponent } from './user-management.component';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({
      queryParams: { subscribe: f => f({}) }
    });
    const routerStub = () => ({ navigate: (array, object) => ({}) });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [UserManagementComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub }
      ]
    });
    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`selectedTab has default value`, () => {
    expect(component.selectedTab).toEqual(0);
  });

  it(`check_tab has default value`, () => {
    expect(component.check_tab).toEqual(0);
  });

  it(`selected_tab_index has default value`, () => {
    expect(component.selected_tab_index).toEqual(0);
  });
});
