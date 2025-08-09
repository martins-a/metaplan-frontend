import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {MyMeta} from '../models/my-meta';
import {MetaListDto} from '../dto/meta-list-dto';
import {environment} from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class MetaApiService {

  baseUrl = environment.apiUrl;

  private readonly httpClient = inject(HttpClient);

  getAllMetas(): Observable<MyMeta[]> {
    return this.httpClient.get<MetaListDto>(`${this.baseUrl}/metas`, {}).pipe(
      map(resp => resp.data!),
      catchError(this.handleError)
    );
  }

  addMeta(meta: MyMeta): Observable<MyMeta> {
    return this.httpClient.post<MyMeta>(`${this.baseUrl}/metas`, meta).pipe(
      catchError(this.handleError)
    )
  }

  editMeta(meta: MyMeta): Observable<MyMeta> {
    return this.httpClient.put<MyMeta>(`${this.baseUrl}/metas`, meta).pipe(
      catchError(this.handleError)
    )
  }

  deleteMeta(id: string): Observable<void> {
    let params = new HttpParams();
    params = params.set('id', id);

    return this.httpClient.delete<void>(`${this.baseUrl}/metas`, { params }).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Server Error: ${error.status} - ${error.message}`;
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}
