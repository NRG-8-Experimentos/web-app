import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberMetricsService {
  constructor(private http: HttpClient) {}

  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getTimePassed(memberId: number, token: string): Observable<any> {
    return this.http.get<any>(
      `/api/v1/metrics/task/member/${memberId}/time-passed`,
      { headers: this.getAuthHeaders(token) }
    );
  }

  getRescheduledTasks(memberId: number, token: string): Observable<any> {
    return this.http.get<any>(
      `/api/v1/metrics/member/${memberId}/tasks/rescheduled`,
      { headers: this.getAuthHeaders(token) }
    );
  }

  getTaskOverview(memberId: number, token: string): Observable<any> {
    return this.http.get<any>(
      `/api/v1/metrics/member/${memberId}/tasks/overview`,
      { headers: this.getAuthHeaders(token) }
    );
  }

  getTaskDistribution(memberId: number, token: string): Observable<any> {
    return this.http.get<any>(
      `/api/v1/metrics/member/${memberId}/tasks/distribution`,
      { headers: this.getAuthHeaders(token) }
    );
  }

  getAvgCompletionTime(memberId: number, token: string): Observable<any> {
    return this.http.get<any>(
      `/api/v1/metrics/member/${memberId}/tasks/avg-completion-time`,
      { headers: this.getAuthHeaders(token) }
    );
  }
}
