import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksApiService, Task, TaskStatus } from '../../services/tasks-api.service';
import { MemberTaskItemComponent } from '../../components/member-task-item/member-task-item';

@Component({
  selector: 'app-tasks-member',
  standalone: true,
  imports: [CommonModule, FormsModule, MemberTaskItemComponent],
  templateUrl: './tasks-member.component.html',
  styleUrls: ['./tasks-member.component.css']
})
export class TasksMemberComponent {
  private api = inject(TasksApiService);

  private allTasks = signal<Task[]>([]);
  totalCount = computed(() => this.allTasks().length);

  filter = signal<TaskStatus | 'ALL'>('ALL');
  TaskStatus = TaskStatus;
  statusOptions: (TaskStatus | 'ALL')[] = ['ALL', TaskStatus.ON_HOLD, TaskStatus.IN_PROGRESS, TaskStatus.DONE, TaskStatus.COMPLETED, TaskStatus.EXPIRED ];

  filtered = computed(() => {
    const f = this.filter();
    const all = this.allTasks();
    return f === 'ALL' ? all : all.filter(t => t.status === f);
  });

  ngOnInit() { this.load(); }

  load(): void {
    this.api.getTasksForAuthenticatedMember().subscribe({
      next: (data: Task[]) => this.allTasks.set(data ?? []),
      error: () => this.allTasks.set([])
    });
  }
}
