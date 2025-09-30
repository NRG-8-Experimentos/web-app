import { Injectable } from '@angular/core';
import { Observable, retry, catchError } from 'rxjs';
import { BaseApiService } from '../../shared/services/base-api.service';
import {
  AvgCompletionTimeResource,
  RescheduledTasksResource,
  TaskDistributionResource,
  TaskOverviewResource
} from '../models/metrics.models';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsMembersApiService extends BaseApiService<unknown> {
  constructor() {
    super();
    this.resourceEndPoint = '/metrics';
  }

  /**
   * Get rescheduled tasks for group
   * GET /api/v1/metrics/tasks/rescheduled
   */
  getRescheduledTasks(): Observable<RescheduledTasksResource> {
    return this.http.get<RescheduledTasksResource>(
      `${this.resourcePath()}/tasks/rescheduled`,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /**
   * Get task overview for group
   * GET /api/v1/metrics/tasks/overview
   */
  getTaskOverview(): Observable<TaskOverviewResource> {
    return this.http.get<TaskOverviewResource>(
      `${this.resourcePath()}/tasks/overview`,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /**
   * Get task distribution for group
   * GET /api/v1/metrics/tasks/distribution
   */
  getTaskDistribution(): Observable<TaskDistributionResource> {
    return this.http.get<TaskDistributionResource>(
      `${this.resourcePath()}/tasks/distribution`,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /**
   * Get average completion time for group
   * GET /api/v1/metrics/tasks/avg-completion-time
   */
  getAvgCompletionTime(): Observable<AvgCompletionTimeResource> {
    return this.http.get<AvgCompletionTimeResource>(
      `${this.resourcePath()}/tasks/avg-completion-time`,
      this.httpOptions
    ).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
