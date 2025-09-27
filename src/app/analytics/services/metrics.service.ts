import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TaskTimePassedResource,
  AvgCompletionTimeResource,
  RescheduledTasksResource,
  TaskDistributionResource,
  TaskOverviewResource
} from '../models/metrics.models';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private readonly baseUrl = '/api/v1/metrics'; // Verifica que este endpoint exista en el backend

  constructor(private http: HttpClient) {}

  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAverageTaskTimePassed(memberId: number, token: string): Observable<TaskTimePassedResource> {
    return this.http.get<TaskTimePassedResource>(
      `${this.baseUrl}/task/member/${memberId}/time-passed`,
      { headers: this.getAuthHeaders(token) }
    );
  }

  getTaskOverview(token: string): Observable<TaskOverviewResource> {
    console.log('GET', `${this.baseUrl}/tasks/overview`);
    return this.http.get<TaskOverviewResource>(
      `${this.baseUrl}/tasks/overview`,
      { headers: this.getAuthHeaders(token) }
    );
  }

  getTaskDistribution(token: string): Observable<TaskDistributionResource> {
    console.log('GET', `${this.baseUrl}/tasks/distribution`);
    return this.http.get<TaskDistributionResource>(
      `${this.baseUrl}/tasks/distribution`,
      { headers: this.getAuthHeaders(token) }
    );
  }

  getRescheduledTasks(token: string): Observable<RescheduledTasksResource> {
    console.log('GET', `${this.baseUrl}/tasks/rescheduled`);
    return this.http.get<RescheduledTasksResource>(
      `${this.baseUrl}/tasks/rescheduled`,
      { headers: this.getAuthHeaders(token) }
    );
  }

  getAvgCompletionTime(token: string): Observable<AvgCompletionTimeResource> {
    console.log('GET', `${this.baseUrl}/tasks/avg-completion-time`);
    return this.http.get<AvgCompletionTimeResource>(
      `${this.baseUrl}/tasks/avg-completion-time`,
      { headers: this.getAuthHeaders(token) }
    );
  }

  getTaskOverviewForMember(memberId: number, token: string): Observable<TaskOverviewResource> {
    return this.http.get<TaskOverviewResource>(
      `${this.baseUrl}/member/${memberId}/tasks/overview`,
      { headers: this.getAuthHeaders(token) }
    );
  }

  getTaskDistributionForMember(memberId: number, token: string): Observable<TaskDistributionResource> {
    return this.http.get<TaskDistributionResource>(
      `${this.baseUrl}/member/${memberId}/tasks/distribution`,
      { headers: this.getAuthHeaders(token) }
    );
  }

  getRescheduledTasksForMember(memberId: number, token: string): Observable<RescheduledTasksResource> {
    return this.http.get<RescheduledTasksResource>(
      `${this.baseUrl}/member/${memberId}/tasks/rescheduled`,
      { headers: this.getAuthHeaders(token) }
    );
  }

  getAvgCompletionTimeForMember(memberId: number, token: string): Observable<AvgCompletionTimeResource> {
    return this.http.get<AvgCompletionTimeResource>(
      `${this.baseUrl}/member/${memberId}/tasks/avg-completion-time`,
      { headers: this.getAuthHeaders(token) }
    );
  }
}
