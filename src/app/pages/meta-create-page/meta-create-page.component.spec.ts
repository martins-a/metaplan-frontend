import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MetaCreatePageComponent } from './meta-create-page.component';
import { MetaApiService } from '../../services/meta-api.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('MetaCreatePageComponent', () => {
  let component: MetaCreatePageComponent;
  let fixture: ComponentFixture<MetaCreatePageComponent>;
  let metaApiService: MetaApiService;
  let alertSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(async () => {
    const metaApiServiceMock = {
      addMeta: jest.fn(),
      editMeta: jest.fn()
    };

    const activatedRouteMock = {
      snapshot: {
        queryParamMap: {
          get: jest.fn()
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MetaApiService, useValue: metaApiServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MetaCreatePageComponent);
    component = fixture.componentInstance;
    metaApiService = TestBed.inject(MetaApiService);

    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the form with default values', () => {
    expect(component.myMetaForm).toBeDefined();

    const form = component.myMetaForm;
    expect(form.get('name')?.value).toBe('');
    expect(form.get('description')?.value).toBe('');
    expect(form.get('objective')?.value).toBe('');
    expect(form.get('completed')?.value).toBe(false);
  });

  it('ngOnInit should get metaId from queryParamMap and log it', () => {
    const activatedRoute = TestBed.inject(ActivatedRoute);
    jest.spyOn(activatedRoute.snapshot.queryParamMap, 'get').mockReturnValue('123');

    component.ngOnInit();

    expect(component.metaId).toBe('123');
    expect(activatedRoute.snapshot.queryParamMap.get).toHaveBeenCalledWith('id');
    expect(consoleLogSpy).toHaveBeenCalledWith('Path parameter (snapshot):', '123');
  });

  it('resetForm should reset form values to empty/default', () => {
    component.myMetaForm.setValue({
      name: 'test name',
      description: 'test description',
      objective: 10,
      completed: true,
    });

    component.resetForm();

    expect(component.myMetaForm.value).toEqual({
      name: '',
      description: '',
      objective: '',
      completed: false,
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      // Fill valid form values
      component.myMetaForm.setValue({
        name: 'Name',
        description: 'Description',
        objective: 100,
        completed: true,
      });

      // Clear metaId
      component.metaId = null;
    });

    it('should call addMeta and alert on create (metaId=null)', fakeAsync(() => {
      const mockMeta = {
        id: undefined,
        name: 'Name',
        description: 'Description',
        objective: 100,
        completed: true,
        reserve: 0,
      };

      (metaApiService.addMeta as jest.Mock).mockReturnValue(of(mockMeta));

      component.onSubmit();
      tick();

      expect(metaApiService.addMeta).toHaveBeenCalledWith(mockMeta);
      expect(alertSpy).toHaveBeenCalledWith('created successfully');
      expect(consoleLogSpy).toHaveBeenCalledWith('Form submitted:', component.myMetaForm.value);
    }));

    it('should call editMeta and alert on edit (metaId set)', fakeAsync(() => {
      component.metaId = 'abc123';

      const mockMeta = {
        id: 'abc123',
        name: 'Name',
        description: 'Description',
        objective: 100,
        completed: true,
        reserve: 0,
      };

      (metaApiService.editMeta as jest.Mock).mockReturnValue(of(mockMeta));

      component.onSubmit();
      tick();

      expect(metaApiService.editMeta).toHaveBeenCalledWith(mockMeta);
      expect(alertSpy).toHaveBeenCalledWith('edited successfully');
      expect(consoleLogSpy).toHaveBeenCalledWith('Form submitted:', component.myMetaForm.value);
    }));

    it('should not submit if form is invalid', () => {
      component.myMetaForm.patchValue({ name: '' });
      component.myMetaForm.markAsDirty();
      component.myMetaForm.updateValueAndValidity();

      component.onSubmit();

      expect(metaApiService.addMeta).not.toHaveBeenCalled();
      expect(metaApiService.editMeta).not.toHaveBeenCalled();
      expect(alertSpy).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });
});
