import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '@app/groups/services/group.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { NgClass } from '@angular/common';
import {Task} from '@app/shared/model/task.entity';

@Component({
  selector: 'app-task-member-details',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, NgClass, MatIconModule, MatButtonModule],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Tareas del grupo</h2>
      <div *ngIf="tasks.length > 0; else noTasks">
        <div *ngFor="let task of tasks" class="rounded-2xl shadow-lg bg-gray-50 p-6 mb-6">
          <div class="font-semibold text-xl mb-2">{{ task.title }}</div>
          <div class="bg-white rounded-lg p-4 shadow mb-2 min-h-[110px]">{{ task.description }}</div>
          <div class="h-2.5 rounded-full mb-2" [ngClass]="getStatusClass(task.status)"></div>
          <div class="text-xs text-center tracking-wide">
            {{ task.dueDate | date:'mediumDate' }} - {{ task.createdAt | date:'mediumDate' }}
          </div>
          <div class="flex gap-4 mt-4 justify-center">
            <button mat-raised-button color="accent"><mat-icon>edit</mat-icon> Editar</button>
            <button mat-raised-button color="warn"><mat-icon>delete</mat-icon> Borrar</button>
          </div>
        </div>
      </div>
      <ng-template #noTasks>
        <p>No hay tareas para mostrar en este grupo.</p>
      </ng-template>
    </div>
  `
})
export class TaskMemberDetailsComponent implements OnInit {
  tasks: Task [] = [];
  groupId!: number;

  constructor(private route: ActivatedRoute, private groupService: GroupService) {}

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('groupId'));
    this.groupService.getAllTasksByGroupId(this.groupId).subscribe({
      next: (tasks: Task[]) => this.tasks = tasks,
      error: (err) => console.error('Error al obtener tareas:', err)
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'COMPLETED': return 'bg-green-500';
      case 'PENDING': return 'bg-yellow-400';
      case 'CANCELLED': return 'bg-red-500';
      default: return '';
    }
  }
}
