import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {CreateGroupRequest} from '@app/groups/model/requests/create-group.request';
import {CreateGroupResponse} from '@app/groups/model/response/create-group.response';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  basePath: string = `${environment.baseUrl}`;
  httpOptions = { headers: new HttpHeaders({'Content-type': 'application/json'}) };

  constructor(private router: Router, private http: HttpClient) { }

  createGroup(createGroupRequest: CreateGroupRequest) {
    //TODO: ADD THE TOKEN TO THE REQUEST
    return this.http.post<CreateGroupResponse>(`${this.basePath}/leader/group`, createGroupRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          this.router.navigate(['/groups']).then();
        },
        error: (error) => {
          console.error(`Error while creating group: ${error}`);
          this.router.navigate(['/create-group']).then();
        }
      });
  }
}
