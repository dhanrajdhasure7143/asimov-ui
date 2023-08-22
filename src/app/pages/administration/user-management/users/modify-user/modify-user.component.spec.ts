import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { RestApiService } from "src/app/pages/services/rest-api.service";
import { LoaderService } from "src/app/services/loader/loader.service";
import { FormsModule } from "@angular/forms";
import { ModifyUserComponent } from "./modify-user.component";
import { of } from "rxjs";

describe("ModifyUserComponent", () => {
  let component: ModifyUserComponent;
  let fixture: ComponentFixture<ModifyUserComponent>;
  let restApiServiceStub1: Partial<RestApiService>;
  let loaderServiceStub1: jasmine.SpyObj<LoaderService>;

  beforeEach(() => {
    restApiServiceStub1 = jasmine.createSpyObj('RestApiService', ['getDepartmentsList']);
    loaderServiceStub1 = jasmine.createSpyObj('LoaderService', ['show']);
    const formBuilderStub = () => ({});
    const activatedRouteStub = () => ({
      queryParams: { subscribe: (f) => f({}) },
    });
    const routerStub = () => ({ navigate: (array, object) => ({}) });
    const restApiServiceStub = () => ({
      getDepartmentsList: () => ({ subscribe: (f) => f({}) }),
      getAllRoles: (number) => ({ subscribe: (f) => f({}) }),
      updateUserRoleDepartment: (body) => ({ subscribe: (f) => f({}) }),
    });
    const loaderServiceStub = () => ({ show: () => ({}), hide: () => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ModifyUserComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: RestApiService, useFactory: restApiServiceStub },
        { provide: LoaderService, useFactory: loaderServiceStub },
      ],
    });
    fixture = TestBed.createComponent(ModifyUserComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`roles has default value`, () => {
    expect(component.roles).toEqual([]);
  });

  it(`roleIds has default value`, () => {
    expect(component.roleIds).toEqual([]);
  });

  it(`isdprtDisabled has default value`, () => {
    expect(component.isdprtDisabled).toEqual(false);
  });

  it(`isdisabled has default value`, () => {
    expect(component.isdisabled).toEqual(true);
  });

  it(`departments has default value`, () => {
    expect(component.departments).toEqual([]);
  });

  it(`depts has default value`, () => {
    expect(component.depts).toEqual([]);
  });

  it(`errShow has default value`, () => {
    expect(component.errShow).toEqual(false);
  });

  it('should call getAllCategories() on ngOnInit', () => {
    spyOn(component, 'getAllCategories');
    component.ngOnInit();
    expect(component.getAllCategories).toHaveBeenCalled();
  });

  describe("getAllCategories", () => {
    it('should call getDepartmentsList and getRoles on getAllCategories', fakeAsync(() => {
      spyOn(component, 'getRoles');
  
      component.getAllCategories();
      tick(); // Simulate the passage of time
  
      expect(restApiServiceStub1.getDepartmentsList).toHaveBeenCalled();
      expect(component.categories).toEqual(['Category1', 'Category2']);
      expect(component.getRoles).toHaveBeenCalled();
    }));
  });

  describe("getRoles", () => {
    it("makes expected calls", () => {
      const restApiServiceStub: RestApiService =
        fixture.debugElement.injector.get(RestApiService);
      const loaderServiceStub: LoaderService =
        fixture.debugElement.injector.get(LoaderService);
      spyOn(restApiServiceStub, "getAllRoles").and.callThrough();
      spyOn(loaderServiceStub, "hide").and.callThrough();
      component.getRoles();
      expect(restApiServiceStub.getAllRoles).toHaveBeenCalled();
      expect(loaderServiceStub.hide).toHaveBeenCalled();
    });
  });

  describe("updateUser", () => {
    it("makes expected calls", () => {
      const restApiServiceStub: RestApiService =
        fixture.debugElement.injector.get(RestApiService);
      const loaderServiceStub: LoaderService =
        fixture.debugElement.injector.get(LoaderService);
      spyOn(component, "userManagementUrl").and.callThrough();
      spyOn(restApiServiceStub, "updateUserRoleDepartment").and.callThrough();
      spyOn(loaderServiceStub, "show").and.callThrough();
      spyOn(loaderServiceStub, "hide").and.callThrough();
      component.updateUser();
      expect(component.userManagementUrl).toHaveBeenCalled();
      expect(restApiServiceStub.updateUserRoleDepartment).toHaveBeenCalled();
      expect(loaderServiceStub.show).toHaveBeenCalled();
      expect(loaderServiceStub.hide).toHaveBeenCalled();
    });
  });

  describe("userManagementUrl", () => {
    it("makes expected calls", () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, "navigate").and.callThrough();
      component.userManagementUrl();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
