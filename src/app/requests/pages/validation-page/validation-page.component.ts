import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {RequestApiService} from '@app/requests/services/request-api.service';
import {Request} from '@app/requests/model/request.entity';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-validation-page',
  imports: [
    NgStyle
  ],
  templateUrl: './validation-page.component.html',
  styleUrl: './validation-page.component.css'
})
export class ValidationPageComponent {
  request: Request | undefined;

  constructor(private router: Router, private requestApiService: RequestApiService) {
  }

  ngOnInit(): void {
    const urlSegments = this.router.url.split('/');
    const taskId = Number(urlSegments[4]);
    const requestId = Number(urlSegments[6]);
    this.getRequestDetails(taskId, requestId);
  }

  getRequestDetails(taskId: number, requestId: number): void {
    this.requestApiService.getRequestByTaskIdAndRequestId(taskId, requestId).subscribe({
      next: (data) => {
        this.request = data;
      },
      error: (e) => console.error(e)
    });
  }

  statusColor(type?: string): string {
    switch (type) {
      case 'SUBMISSION': return '#4CAF50';
      case 'MODIFICATION': return '#FF832A';
      case 'EXPIRED': return '#FF5252';
      default: return '#E0E0E0';
    }
  }

  createdDate(timestamp?: string): string | undefined {
    if (!timestamp) return undefined;
    try {
      return new Date(timestamp).toISOString().slice(0, 10);
    } catch {
      return timestamp.substring(0, 10);
    }
  }

  dueDate(timestamp?: string): string | undefined {
    if (!timestamp) return undefined;
    try {
      const date = new Date(timestamp);
      return date.toISOString().slice(0, 16).replace('T', ' ');
    } catch {
      return timestamp.replace('T', ' ').substring(0, 16);
    }
  }

  reprogram(): void {
    if (this.request)
      this.router.navigate([`/validation/edit/${this.request.task.id}/${this.request.id}`]);
  }

  markAsCompleted(): void {
    // Aquí deberías llamar a los servicios para actualizar el estado
    // y luego navegar o actualizar la vista
    // Ejemplo:
    // this.requestApiService.updateRequestStatus(...);
    // this.taskApiService.updateTaskStatus(...);
    this.router.navigate(['/leaders/my-group/request-&-validations']); // Simula popBackStack
  }

  denyModification(): void {
    // Lógica similar a markAsCompleted, pero para denegar
    this.router.navigate(['/leaders/my-group/request-&-validations']);
  }

}
