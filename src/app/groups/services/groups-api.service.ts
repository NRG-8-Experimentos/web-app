import { Injectable } from '@angular/core';
import {BaseApiService} from '../../shared/services/base-api.service';
import {Group} from '../model/group.entity';
import {Observable} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupsApiService extends BaseApiService<Group>{
  constructor() {
    super();
    this.resourceEndPoint = '/groups';
  }

  searchGroupByCode(code: string): Observable<Group> {
    const options = {
      headers: this.httpOptions.headers,
      params: { code }
    };
    return this.http.get<Group>(`${this.resourcePath()}/search`, options);
  }

  getGroupByMember(): Observable<Group> {
    return this.http.get<Group>(`${this.resourcePath()}/member`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
