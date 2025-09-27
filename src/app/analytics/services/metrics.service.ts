import { Injectable } from '@angular/core';
import { Observable, retry, catchError, tap } from 'rxjs';
import { BaseApiService } from '../../shared/services/base-api.service';
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
export class MetricsService extends BaseApiService<any> {
  constructor() {
    super();
    this.resourceEndPoint = '/metrics';
  }

  getAverageTaskTimePassed(memberId: number): Observable<TaskTimePassedResource> {
    return this.http.get<TaskTimePassedResource>(`${this.resourcePath()}/task/member/${memberId}/time-passed`, this.httpOptions).pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  getTaskOverview(): Observable<TaskOverviewResource> {
    return this.http.get<TaskOverviewResource>(`${this.resourcePath()}/tasks/overview`, this.httpOptions).pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  getTaskDistribution(): Observable<TaskDistributionResource> {
    return this.http.get<TaskDistributionResource>(`${this.resourcePath()}/tasks/distribution`, this.httpOptions).pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  getRescheduledTasks(): Observable<RescheduledTasksResource> {
    return this.http.get<RescheduledTasksResource>(`${this.resourcePath()}/tasks/rescheduled`, this.httpOptions).pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  getAvgCompletionTime(): Observable<AvgCompletionTimeResource> {
    return this.http.get<AvgCompletionTimeResource>(`${this.resourcePath()}/tasks/avg-completion-time`, this.httpOptions).pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  getTaskOverviewForMember(memberId: number): Observable<TaskOverviewResource> {
    return this.http.get<TaskOverviewResource>(`${this.resourcePath()}/member/${memberId}/tasks/overview`, this.httpOptions).pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  getTaskDistributionForMember(memberId: number): Observable<TaskDistributionResource> {
    return this.http.get<TaskDistributionResource>(`${this.resourcePath()}/member/${memberId}/tasks/distribution`, this.httpOptions).pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  getRescheduledTasksForMember(memberId: number): Observable<RescheduledTasksResource> {
    return this.http.get<RescheduledTasksResource>(`${this.resourcePath()}/member/${memberId}/tasks/rescheduled`, this.httpOptions).pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  getAvgCompletionTimeForMember(memberId: number): Observable<AvgCompletionTimeResource> {
    return this.http.get<AvgCompletionTimeResource>(`${this.resourcePath()}/member/${memberId}/tasks/avg-completion-time`, this.httpOptions).pipe(
        retry(2),
        catchError(this.handleError)
    );
  }

  /**
   * Obtiene las tareas de un miembro desde api/v1/member/tasks
   */
  getMemberTasks(memberId: number): Observable<any> {
    return this.http.get<any>(`/api/v1/member/tasks?memberId=${memberId}`, this.httpOptions).pipe(
        retry(2),
        tap(response => console.log('getMemberTasks response:', response)),
        catchError(this.handleError)
    );
  }

  getTimePassedForMember(memberId: number): Observable<TaskTimePassedResource> {
    return this.http.get<TaskTimePassedResource>(
        `${this.resourcePath()}/task/member/${memberId}/time-passed`,
        this.httpOptions
    ).pipe(
        retry(2),
        catchError(this.handleError)
    );
  }
}
