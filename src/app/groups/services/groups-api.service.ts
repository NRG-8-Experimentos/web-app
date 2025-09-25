import { Injectable } from '@angular/core';
import {BaseApiService} from '../../shared/services/base-api.service';
import {Group} from '../model/group.entity';
import {Observable} from 'rxjs';

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


}
