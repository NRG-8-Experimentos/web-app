import { Injectable } from '@angular/core';
import {BaseApiService} from '@app/shared/services/base-api.service';
import {Request} from '@app/requests/model/request.entity';
import {catchError, Observable, retry} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestApiService extends BaseApiService<Request>{
  constructor() {
    super();
    this.resourceEndPoint = '';
  }

  getLeaderRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.resourcePath()}/leader/group/requests`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getMemberRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.resourcePath()}/member/group/requests`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getRequestByTaskIdAndRequestId(taskId: number, requestId: number): Observable<Request> {
    return this.http.get<Request>(`${this.resourcePath()}/tasks/${taskId}/requests/${requestId}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
