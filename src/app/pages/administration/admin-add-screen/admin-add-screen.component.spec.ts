import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RestApiService } from '../../services/rest-api.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { columnList } from 'src/app/shared/model/table_columns';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminAddScreenComponent } from './admin-add-screen.component';

describe('AdminAddScreenComponent', () => {
  let component: AdminAddScreenComponent;
  let fixture: ComponentFixture<AdminAddScreenComponent>;

  beforeEach(() => {
    const formBuilderStub = () => ({ group: object => ({}) });
    const activatedRouteStub = () => ({
      queryParams: { subscribe: f => f({}) }
    });
    const routerStub = () => ({ navigate: array => ({}) });
    const restApiServiceStub = () => ({
      updateColumn: (elementId, screenId, val) => ({ subscribe: f => f({}) }),
      getListOfTables: () => ({ subscribe: f => f({}) }),
      getTabledataAdmin: value => ({ subscribe: f => f({}) }),
      getScreenList: () => ({ subscribe: f => f({}) }),
      getElementTable: screen_id => ({ subscribe: f => f({}) }),
      updateScreenData: (payload, screen_id) => ({ subscribe: f => f({}) }),
      saveScreenData: payload => ({ subscribe: f => f({}) }),
      checkScreenName: screenName => ({ subscribe: f => f({}) })
    });
    const loaderServiceStub = () => ({ show: () => ({}), hide: () => ({}) });
    const columnListStub = () => ({
      adminChangeTable_column: {},
      adminAddScreen_column: {},
      saveTable_column: {}
    });
    const messageServiceStub = () => ({ add: object => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AdminAddScreenComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: RestApiService, useFactory: restApiServiceStub },
        { provide: LoaderService, useFactory: loaderServiceStub },
        { provide: columnList, useFactory: columnListStub },
        { provide: MessageService, useFactory: messageServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AdminAddScreenComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`tableData has default value`, () => {
    expect(component.tableData).toEqual([]);
  });

  it(`columns_list has default value`, () => {
    expect(component.columns_list).toEqual([]);
  });

  it(`tableListData has default value`, () => {
    expect(component.tableListData).toEqual([]);
  });

  it(`textAlign has default value`, () => {
    expect(component.textAlign).toEqual([`Right`, `Left`, `Center`]);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`tablehide has default value`, () => {
    expect(component.tablehide).toEqual(false);
  });

  it(`isDisabled has default value`, () => {
    expect(component.isDisabled).toEqual(false);
  });

  it(`savedata has default value`, () => {
    expect(component.savedata).toEqual([]);
  });

  it(`updateColumndata has default value`, () => {
    expect(component.updateColumndata).toEqual([]);
  });

  it(`buttonDisable has default value`, () => {
    expect(component.buttonDisable).toEqual(false);
  });

  it(`elementData has default value`, () => {
    expect(component.elementData).toEqual([]);
  });

  it(`showCheckbox has default value`, () => {
    expect(component.showCheckbox).toEqual(false);
  });

  it(`labelupdate has default value`, () => {
    expect(component.labelupdate).toEqual(false);
  });

  it(`display has default value`, () => {
    expect(component.display).toEqual(false);
  });

  it(`table_searchFields has default value`, () => {
    expect(component.table_searchFields).toEqual([]);
  });

  it(`hiddenPopUp has default value`, () => {
    expect(component.hiddenPopUp).toEqual(false);
  });

  it(`myValue has default value`, () => {
    expect(component.myValue).toEqual(0);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
        FormBuilder
      );
      spyOn(component, 'getListofTables').and.callThrough();
      spyOn(component, 'getScreenDetail').and.callThrough();
      spyOn(formBuilderStub, 'group').and.callThrough();
      component.ngOnInit();
      expect(component.getListofTables).toHaveBeenCalled();
      expect(component.getScreenDetail).toHaveBeenCalled();
      expect(formBuilderStub.group).toHaveBeenCalled();
    });
  });

  describe('backToScreenList', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, 'navigate').and.callThrough();
      component.backToScreenList();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });

  describe('updateColumn', () => {
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
      spyOn(component, 'getScreenDetail').and.callThrough();
      spyOn(restApiServiceStub, 'updateColumn').and.callThrough();
      spyOn(loaderServiceStub, 'show').and.callThrough();
      spyOn(loaderServiceStub, 'hide').and.callThrough();
      spyOn(messageServiceStub, 'add').and.callThrough();
      component.updateColumn();
      expect(component.getScreenDetail).toHaveBeenCalled();
      expect(restApiServiceStub.updateColumn).toHaveBeenCalled();
      expect(loaderServiceStub.show).toHaveBeenCalled();
      expect(loaderServiceStub.hide).toHaveBeenCalled();
      expect(messageServiceStub.add).toHaveBeenCalled();
    });
  });

  describe('getListofTables', () => {
    it('makes expected calls', () => {
      const restApiServiceStub: RestApiService = fixture.debugElement.injector.get(
        RestApiService
      );
      const loaderServiceStub: LoaderService = fixture.debugElement.injector.get(
        LoaderService
      );
      spyOn(restApiServiceStub, 'getListOfTables').and.callThrough();
      spyOn(loaderServiceStub, 'show').and.callThrough();
      spyOn(loaderServiceStub, 'hide').and.callThrough();
      component.getListofTables();
      expect(restApiServiceStub.getListOfTables).toHaveBeenCalled();
      expect(loaderServiceStub.show).toHaveBeenCalled();
      expect(loaderServiceStub.hide).toHaveBeenCalled();
    });
  });

  describe('getScreenDetail', () => {
    it('makes expected calls', () => {
      const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
        FormBuilder
      );
      const restApiServiceStub: RestApiService = fixture.debugElement.injector.get(
        RestApiService
      );
      const loaderServiceStub: LoaderService = fixture.debugElement.injector.get(
        LoaderService
      );
      spyOn(formBuilderStub, 'group').and.callThrough();
      spyOn(restApiServiceStub, 'getScreenList').and.callThrough();
      spyOn(restApiServiceStub, 'getElementTable').and.callThrough();
      spyOn(loaderServiceStub, 'show').and.callThrough();
      spyOn(loaderServiceStub, 'hide').and.callThrough();
      component.getScreenDetail();
      expect(formBuilderStub.group).toHaveBeenCalled();
      expect(restApiServiceStub.getScreenList).toHaveBeenCalled();
      expect(restApiServiceStub.getElementTable).toHaveBeenCalled();
      expect(loaderServiceStub.show).toHaveBeenCalled();
      expect(loaderServiceStub.hide).toHaveBeenCalled();
    });
  });

  describe('updateData', () => {
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
      spyOn(component, 'backToScreenList').and.callThrough();
      spyOn(restApiServiceStub, 'updateScreenData').and.callThrough();
      spyOn(loaderServiceStub, 'show').and.callThrough();
      spyOn(loaderServiceStub, 'hide').and.callThrough();
      spyOn(messageServiceStub, 'add').and.callThrough();
      component.updateData();
      expect(component.backToScreenList).toHaveBeenCalled();
      expect(restApiServiceStub.updateScreenData).toHaveBeenCalled();
      expect(loaderServiceStub.show).toHaveBeenCalled();
      expect(loaderServiceStub.hide).toHaveBeenCalled();
      expect(messageServiceStub.add).toHaveBeenCalled();
    });
  });

  describe('saveScreen', () => {
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
      spyOn(component, 'backToScreenList').and.callThrough();
      spyOn(restApiServiceStub, 'saveScreenData').and.callThrough();
      spyOn(loaderServiceStub, 'show').and.callThrough();
      spyOn(loaderServiceStub, 'hide').and.callThrough();
      spyOn(messageServiceStub, 'add').and.callThrough();
      component.saveScreen();
      expect(component.backToScreenList).toHaveBeenCalled();
      expect(restApiServiceStub.saveScreenData).toHaveBeenCalled();
      expect(loaderServiceStub.show).toHaveBeenCalled();
      expect(loaderServiceStub.hide).toHaveBeenCalled();
      expect(messageServiceStub.add).toHaveBeenCalled();
    });
  });

  describe('checkScreenName', () => {
    it('makes expected calls', () => {
      const restApiServiceStub: RestApiService = fixture.debugElement.injector.get(
        RestApiService
      );
      spyOn(restApiServiceStub, 'checkScreenName').and.callThrough();
      component.checkScreenName();
      expect(restApiServiceStub.checkScreenName).toHaveBeenCalled();
    });
  });
});
