import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MetaApiService } from './meta-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { MyMeta } from '../models/my-meta';
import {MetaListDto} from '../dto/meta-list-dto';

describe('MetaApiService', () => {
  let service: MetaApiService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MetaApiService]
    });
    service = TestBed.inject(MetaApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all metas', done => {
    const mockResponse: MetaListDto = {
      data: [
        {
          id: '1',
          name: 'Meta1',
          description: 'Description1',
          reserve: 100,
          objective: 200,
          completed: false
        }
      ],
      pagination: { current: 1, pages: 10, total: 1 }
    };

    service.getAllMetas().subscribe(metas => {
      expect(metas.length).toBe(1);
      expect(metas[0].id).toBe('1');
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/metas`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should add a meta and return it', done => {
    const newMeta: MyMeta = {
      id: '2',
      name: 'NewMeta',
      description: 'New Description',
      reserve: 50,
      objective: 150,
      completed: false
    };

    service.addMeta(newMeta).subscribe(meta => {
      expect(meta.id).toBe('2');
      expect(meta.name).toBe('NewMeta');
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/metas`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newMeta);
    req.flush(newMeta);
  });

  it('should edit a meta and return it', done => {
    const editedMeta: MyMeta = {
      id: '3',
      name: 'EditedMeta',
      description: 'Edited Description',
      reserve: 70,
      objective: 170,
      completed: true
    };

    service.editMeta(editedMeta).subscribe(meta => {
      expect(meta.id).toBe('3');
      expect(meta.completed).toBe(true);
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/metas`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(editedMeta);
    req.flush(editedMeta);
  });

  it('should delete a meta by id', done => {
    const idToDelete = '4';

    service.deleteMeta(idToDelete).subscribe(response => {
      expect(response).toBeFalsy();
      done();
    });

    const req = httpMock.expectOne(r => r.url === `${baseUrl}/metas` && r.params.get('id') === idToDelete);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle client error in getAllMetas', done => {
    const mockError = new ErrorEvent('Network error', {
      message: 'Client-side failure'
    });
    service.getAllMetas().subscribe({
      next: () => fail('Should have failed with client error'),
      error: (error: Error) => {
        expect(error.message).toContain('Client Error: Client-side failure');
        done();
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/metas`);
    req.error(mockError);
  });

  it('should handle server error in addMeta', done => {
    const serverError = { message: 'Server is down' };
    const meta: MyMeta = {
      id: '5',
      name: 'Meta5',
      description: 'Desc5',
      reserve: 20,
      objective: 40,
      completed: false
    };

    service.addMeta(meta).subscribe({
      next: () => fail('Should have failed with server error'),
      error: (error: Error) => {
        expect(error.message).toBe(serverError.message);
        done();
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/metas`);
    req.flush(serverError, { status: 503, statusText: 'Service Unavailable' });
  });

  it('should handle unknown server error in editMeta', done => {
    const meta: MyMeta = {
      id: '6',
      name: 'Meta6',
      description: 'Desc6',
      reserve: 10,
      objective: 30,
      completed: true
    };

    service.editMeta(meta).subscribe({
      next: () => fail('Should have failed with server error'),
      error: (error: Error) => {
        expect(error.message).toContain('Server Error: 500');
        done();
      }
    });

    const req = httpMock.expectOne(`${baseUrl}/metas`);
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle error in deleteMeta', done => {
    const idToDelete = '7';
    const errorMessage = 'Not Found';

    service.deleteMeta(idToDelete).subscribe({
      next: () => fail('Should have failed'),
      error: (error: Error) => {
        expect(error.message).toContain(errorMessage);
        done();
      }
    });

    const req = httpMock.expectOne(r => r.url === `${baseUrl}/metas` && r.params.get('id') === idToDelete);
    req.flush({ message: errorMessage }, { status: 404, statusText: 'Not Found' });
  });
});
