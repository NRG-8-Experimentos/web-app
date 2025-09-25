import { Injectable } from '@angular/core';
import {BaseApiService} from '../../shared/services/base-api.service';
import {Invitation} from '../model/invitation.entity';
import {catchError, Observable, retry} from 'rxjs';
import {Group} from '../../groups/model/group.entity';

@Injectable({
  providedIn: 'root'
})
export class InvitationsApiService extends BaseApiService<Invitation>{
  constructor() {
    super();
    this.resourceEndPoint = '/invitations';
  }

  getInvitationsByMember(): Observable<Invitation> {
    return this.http.get<Invitation>(`${this.resourcePath()}/member`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  cancelInvitation(): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath()}/member`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
