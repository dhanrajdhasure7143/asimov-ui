import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { RestApiService } from '../../services/rest-api.service';
import { columnList } from 'src/app/shared/model/table_columns';
import { DataTransferService } from '../../services/data-transfer.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { AdminScreenListComponent } from './admin-screen-list.component';

describe('AdminScreenListComponent', () => {
  let component: AdminScreenListComponent;
  let fixture: ComponentFixture<AdminScreenListComponent>;

  beforeEach(() => {
    const routerStub = () => ({ navigate: array => ({}) });
    const loaderServiceStub = () => ({ show: () => ({}), hide: () => ({}) });
    const restApiServiceStub = () => ({
      getScreenList: () => ({ subscribe: f => f({}) }),
      deleteScreen: screen_ID => ({ subscribe: f => f({}) })
    });
    const columnListStub = () => ({ adminScreenlist_column: {} });
    const dataTransferServiceStub = () => ({ setScreenList: screen => ({}) });
    const confirmationServiceStub = () => ({ confirm: object => ({}) });
    const messageServiceStub = () => ({ add: object => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AdminScreenListComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: LoaderService, useFactory: loaderServiceStub },
        { provide: RestApiService, useFactory: restApiServiceStub },
        { provide: columnList, useFactory: columnListStub },
        { provide: DataTransferService, useFactory: dataTransferServiceStub },
        { provide: ConfirmationService, useFactory: confirmationServiceStub },
        { provide: MessageService, useFactory: messageServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AdminScreenListComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`screenlist has default value`, () => {
    expect(component.screenlist).toEqual([]);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`columns_list has default value`, () => {
    expect(component.columns_list).toEqual([]);
  });

  it(`table_searchFields has default value`, () => {
    expect(component.table_searchFields).toEqual([]);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getScreenList').and.callThrough();
      component.ngOnInit();
      expect(component.getScreenList).toHaveBeenCalled();
    });
  });

  describe('addNew', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, 'navigate').and.callThrough();
      component.addNew();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });

  describe('getScreenList', () => {
    it('makes expected calls', () => {
      const loaderServiceStub: LoaderService = fixture.debugElement.injector.get(
        LoaderService
      );
      const restApiServiceStub: RestApiService = fixture.debugElement.injector.get(
        RestApiService
      );
      spyOn(loaderServiceStub, 'show').and.callThrough();
      spyOn(loaderServiceStub, 'hide').and.callThrough();
      spyOn(restApiServiceStub, 'getScreenList').and.callThrough();
      component.getScreenList();
      expect(loaderServiceStub.show).toHaveBeenCalled();
      expect(loaderServiceStub.hide).toHaveBeenCalled();
      expect(restApiServiceStub.getScreenList).toHaveBeenCalled();
    });
  });
});
