import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/pages/services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { columnList } from 'src/app/shared/model/table_columns';
import { NgForm } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { DataTransferService } from 'src/app/pages/services/data-transfer.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(() => {
    const routerStub = () => ({ navigate: array => ({}) });
    const restApiServiceStub = () => ({
      getuserslist: (masterTenant, tenantid) => ({ subscribe: f => f({}) }),
      deleteSelectedUser: email => ({ subscribe: f => f({}) }),
      getDepartmentsList: () => ({ subscribe: f => f({}) }),
      getAllRoles: number => ({ subscribe: f => f({}) }),
      updateUserRoleDepartment: body => ({ subscribe: f => f({}) }),
      getWhiteListedDomain: arg => ({ subscribe: f => f({}) }),
      inviteUserwithoutReg: body => ({ subscribe: f => f({}) })
    });
    const loaderServiceStub = () => ({ show: () => ({}), hide: () => ({}) });
    const columnListStub = () => ({ users_columns: {} });
    const titleCasePipeStub = () => ({ transform: firstName => ({}) });
    const dataTransferServiceStub = () => ({
      tenantBasedUsersList: resp => ({})
    });
    const messageServiceStub = () => ({ add: object => ({}) });
    const confirmationServiceStub = () => ({ confirm: object => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [UsersComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: RestApiService, useFactory: restApiServiceStub },
        { provide: LoaderService, useFactory: loaderServiceStub },
        { provide: columnList, useFactory: columnListStub },
        { provide: TitleCasePipe, useFactory: titleCasePipeStub },
        { provide: DataTransferService, useFactory: dataTransferServiceStub },
        { provide: MessageService, useFactory: messageServiceStub },
        { provide: ConfirmationService, useFactory: confirmationServiceStub }
      ]
    });
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`userslist has default value`, () => {
    expect(component.userslist).toEqual([]);
  });

  it(`columns_list has default value`, () => {
    expect(component.columns_list).toEqual([]);
  });

  it(`table_searchFields has default value`, () => {
    expect(component.table_searchFields).toEqual([]);
  });

  it(`categories has default value`, () => {
    expect(component.categories).toEqual([]);
  });

  it(`roles has default value`, () => {
    expect(component.roles).toEqual([]);
  });

  it(`isdprtDisabled has default value`, () => {
    expect(component.isdprtDisabled).toEqual(false);
  });

  it(`people has default value`, () => {
    expect(component.people).toEqual([]);
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

  it(`emailRequired has default value`, () => {
    expect(component.emailRequired).toEqual(false);
  });

  it(`hideInvitePopUp has default value`, () => {
    expect(component.hideInvitePopUp).toEqual(false);
  });

  it(`isUpdate has default value`, () => {
    expect(component.isUpdate).toEqual(false);
  });

  describe('resetUserInvite', () => {
    it('makes expected calls', () => {
      const ngFormStub: NgForm = <any>{};
      spyOn(ngFormStub, 'resetForm').and.callThrough();
      component.resetUserInvite(ngFormStub);
      expect(ngFormStub.resetForm).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getUsers').and.callThrough();
      spyOn(component, 'getAllCategories').and.callThrough();
      spyOn(component, 'getRoles').and.callThrough();
      component.ngOnInit();
      expect(component.getUsers).toHaveBeenCalled();
      expect(component.getAllCategories).toHaveBeenCalled();
      expect(component.getRoles).toHaveBeenCalled();
    });
  });

  describe('getUsers', () => {
    it('makes expected calls', () => {
      const restApiServiceStub: RestApiService = fixture.debugElement.injector.get(
        RestApiService
      );
      const loaderServiceStub: LoaderService = fixture.debugElement.injector.get(
        LoaderService
      );
      const titleCasePipeStub: TitleCasePipe = fixture.debugElement.injector.get(
        TitleCasePipe
      );
      const dataTransferServiceStub: DataTransferService = fixture.debugElement.injector.get(
        DataTransferService
      );
      spyOn(restApiServiceStub, 'getuserslist').and.callThrough();
      spyOn(loaderServiceStub, 'show').and.callThrough();
      spyOn(loaderServiceStub, 'hide').and.callThrough();
      spyOn(titleCasePipeStub, 'transform').and.callThrough();
      spyOn(dataTransferServiceStub, 'tenantBasedUsersList').and.callThrough();
      component.getUsers();
      expect(restApiServiceStub.getuserslist).toHaveBeenCalled();
      expect(loaderServiceStub.show).toHaveBeenCalled();
      expect(loaderServiceStub.hide).toHaveBeenCalled();
      expect(titleCasePipeStub.transform).toHaveBeenCalled();
      expect(dataTransferServiceStub.tenantBasedUsersList).toHaveBeenCalled();
    });
  });

  describe('openInviteUserOverlay', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const confirmationServiceStub: ConfirmationService = fixture.debugElement.injector.get(
        ConfirmationService
      );
      spyOn(routerStub, 'navigate').and.callThrough();
      spyOn(confirmationServiceStub, 'confirm').and.callThrough();
      component.openInviteUserOverlay();
      expect(routerStub.navigate).toHaveBeenCalled();
      expect(confirmationServiceStub.confirm).toHaveBeenCalled();
    });
  });

  describe('getAllCategories', () => {
    it('makes expected calls', () => {
      const restApiServiceStub: RestApiService = fixture.debugElement.injector.get(
        RestApiService
      );
      spyOn(component, 'getRoles').and.callThrough();
      spyOn(restApiServiceStub, 'getDepartmentsList').and.callThrough();
      component.getAllCategories();
      expect(component.getRoles).toHaveBeenCalled();
      expect(restApiServiceStub.getDepartmentsList).toHaveBeenCalled();
    });
  });

  describe('getRoles', () => {
    it('makes expected calls', () => {
      const restApiServiceStub: RestApiService = fixture.debugElement.injector.get(
        RestApiService
      );
      spyOn(restApiServiceStub, 'getAllRoles').and.callThrough();
      component.getRoles();
      expect(restApiServiceStub.getAllRoles).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('makes expected calls', () => {
      const restApiServiceStub: RestApiService = fixture.debugElement.injector.get(
        RestApiService
      );
      const loaderServiceStub: LoaderService = fixture.debugElement.injector.get(
        LoaderService
      );
      const messageServiceStub: MessageService = fixture.debugElement.injector.get(
        MessageService
      );
      spyOn(component, 'getUsers').and.callThrough();
      spyOn(restApiServiceStub, 'updateUserRoleDepartment').and.callThrough();
      spyOn(loaderServiceStub, 'show').and.callThrough();
      spyOn(loaderServiceStub, 'hide').and.callThrough();
      spyOn(messageServiceStub, 'add').and.callThrough();
      component.updateUser();
      expect(component.getUsers).toHaveBeenCalled();
      expect(restApiServiceStub.updateUserRoleDepartment).toHaveBeenCalled();
      expect(loaderServiceStub.show).toHaveBeenCalled();
      expect(loaderServiceStub.hide).toHaveBeenCalled();
      expect(messageServiceStub.add).toHaveBeenCalled();
    });
  });
});
