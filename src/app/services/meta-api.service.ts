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
    let params = new HttpParams();

    return this.httpClient.get<MetaListDto>(`${this.baseUrl}/metas`, {}).pipe(
      map(resp => resp.data!),
      catchError(this.handleError)
    );
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
