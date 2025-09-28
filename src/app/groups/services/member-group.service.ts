import { Injectable } from '@angular/core';
import {BaseApiService} from '@app/shared/services/base-api.service';
import {Group} from '@app/groups/model/group.entity';
import {catchError, Observable, retry} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberGroupService extends BaseApiService<Group>{
  constructor() {
    super();
    this.resourceEndPoint = '/member';
  }

  getMemberGroup(): Observable<Group> {
    return this.http.get<Group>(`${this.resourcePath()}/group`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }


}
