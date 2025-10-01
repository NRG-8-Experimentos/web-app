import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, forkJoin, map, catchError, of} from 'rxjs';

import { environment } from '../../../environments/environment';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  OVERDUE = 'OVERDUE'
}

export interface TaskMember {
  id: number;
  name: string;
  surname: string;
  urlImage: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  status: TaskStatus | string;
  member?: TaskMember | null;
  groupId?: number;
}

@Injectable({ providedIn: 'root' })
export class TasksApiService {
  private http = inject(HttpClient);

  private readonly BASE = `${environment.baseUrl}/tasks`;

  // ==== GET ====
  getByStatus(status: TaskStatus): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.BASE}/status/${status}`);
  }

  // dentro de TasksApiService
  getById(taskId: number) {
    return this.http.get<Task>(`${this.BASE}/${taskId}`);
  }


  // helper para "ALL"
  getAllStatuses() {
    const statuses = [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.DONE, TaskStatus.OVERDUE];
    return forkJoin(
      statuses.map(s =>
        this.getByStatus(s).pipe(
          // Si el backend devuelve 404 cuando no hay tareas, devolvemos [] en su lugar
          catchError(() => of([] as Task[]))
        )
      )
    ).pipe(map(parts => parts.flat()));
  }

  // ==== POST ====
  // Body esperado por Swagger: { title, description, dueDate, memberId }
  createTask(payload: { title: string; description?: string; dueDate?: string; memberId?: number }): Observable<void> {
    return this.http.post<void>(`${this.BASE}`, payload);
  }

  // ==== PUT ====
  updateTask(taskId: number, payload: { title?: string; description?: string; dueDate?: string; memberId?: number }): Observable<void> {
    return this.http.put<void>(`${this.BASE}/${taskId}`, payload);
  }

  updateStatus(taskId: number, status: TaskStatus): Observable<void> {
    return this.http.put<void>(`${this.BASE}/${taskId}/status/${status}`, {});
  }

  // ==== DELETE ====
  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${taskId}`);
  }
}
