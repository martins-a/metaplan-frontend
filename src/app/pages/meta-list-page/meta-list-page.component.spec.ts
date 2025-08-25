import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MetaListPageComponent } from './meta-list-page.component';
import { MetaApiService } from '../../services/meta-api.service';
import {ActivatedRoute, Router} from '@angular/router';
import { of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MyMeta } from '../../models/my-meta';
import { environment } from '../../../environment/environment';

describe('MetaListPageComponent', () => {
  let component: MetaListPageComponent;
  let fixture: ComponentFixture<MetaListPageComponent>;
  let metaApiService: MetaApiService;
  let router: Router;

  const mockMetas: MyMeta[] = [
    { id: '1', name: 'Meta 1', description: 'Desc 1', reserve: 100, objective: 200, completed: false },
    { id: '2', name: 'Meta 2', description: 'Desc 2', reserve: 150, objective: 250, completed: true }
  ];

  beforeEach(waitForAsync(() => {
    const metaApiServiceMock = {
      getAllMetas: jest.fn().mockReturnValue(of(mockMetas)),
      deleteMeta: jest.fn().mockReturnValue(of('')),
    };
    const routerMock = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: MetaApiService, useValue: metaApiServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: jest.fn(),
            navigate: jest.fn(),
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MetaListPageComponent);
    component = fixture.componentInstance;
    metaApiService = TestBed.inject(MetaApiService);
    router = TestBed.inject(Router);

    // Set a dummy paginator for the component
    component.paginator = {
      pageIndex: 0,
      pageSize: 10,
      length: 0,
      firstPage: jest.fn(),
      lastPage: jest.fn(),
      nextPage: jest.fn(),
      previousPage: jest.fn(),
      hasNextPage: false,
      hasPreviousPage: false,
      page: of(),
      _changePageSize: jest.fn()
    } as unknown as MatPaginator;
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ngAfterViewInit', () => {
    it('should call getRecords when view initialized', () => {
      const getRecordsSpy = jest.spyOn(component, 'getRecords');
      component.ngAfterViewInit();
      expect(getRecordsSpy).toHaveBeenCalled();
    });
  });

  describe('getRecords', () => {
    it('should set datasource from mockMeta when environment.useMock is true', () => {
      environment.useMock = true;
      component.getRecords();
      expect(component.dataSource.data.length).toBeGreaterThan(0);
      expect(component.dataSource.paginator).toBe(component.paginator);
    });

    it('should call metaApiService.getAllMetas and set datasource when environment.useMock is false', () => {
      environment.useMock = false;
      (metaApiService.getAllMetas as jest.Mock).mockReturnValue(of(mockMetas));

      component.getRecords();

      expect(metaApiService.getAllMetas).toHaveBeenCalled();
      expect(component.dataSource.data).toEqual(mockMetas);
      expect(component.dataSource.paginator).toBe(component.paginator);
    });
  });

  describe('editRecord', () => {
    it('should navigate to /meta-create with query param id', () => {
      component.editRecord(123);

      expect(router.navigate).toHaveBeenCalledWith(['/meta-create'], {
        queryParams: { id: 123 }
      });
    });
  });

  describe('deleteRecord', () => {
    let alertSpy: jest.SpyInstance;
    beforeEach(() => {
      alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      jest.spyOn(component as any, 'debugger', 'get').mockImplementation(() => { });
    });

    afterEach(() => {
      alertSpy.mockRestore();
    });

    it('should alert id and deleted when environment.useMock is true', () => {
      environment.useMock = true;
      component.deleteRecord('abc');

      expect(alertSpy).toHaveBeenCalledWith('abc');
      expect(alertSpy).toHaveBeenCalledWith('deleted');
      expect(metaApiService.deleteMeta).not.toHaveBeenCalled();
    });

    it('should call metaApiService.deleteMeta and alert deleted when environment.useMock is false', () => {
      environment.useMock = false;
      (metaApiService.deleteMeta as jest.Mock).mockReturnValue(of(void 0));

      component.deleteRecord('xyz');

      expect(alertSpy).toHaveBeenCalledWith('xyz');
      expect(metaApiService.deleteMeta).toHaveBeenCalledWith('xyz');
      // Because deleteMeta is async, simulate subscription completion with flush
      // but since we don't have fakeAsync here, just check for alert 'deleted' in subscribe
      // so test it using done callback or async, but here we wait for sync subscription execution:
      expect(alertSpy).toHaveBeenCalledWith('deleted');
    });
  });
});
