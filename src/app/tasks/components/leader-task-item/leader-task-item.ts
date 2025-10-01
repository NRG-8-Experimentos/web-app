import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Task, TaskStatus } from '../../model/task.model';
import { TasksApiService } from '../../services/tasks-api.service';

@Component({
  selector: 'leader-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leader-task-item.html',
  styleUrls: ['./leader-task-item.css']
})
export class LeaderTaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() changed = new EventEmitter<void>();

  protected api = inject(TasksApiService);
  private router = inject(Router);

  open() {
    this.router.navigate(['/leaders/my-group/tasks', this.task.id]);
  }

  edit(ev?: Event) {
    ev?.stopPropagation();
    this.router.navigate(['/leaders/my-group/tasks', this.task.id, 'edit']);
  }

  remove(ev?: Event) {
    ev?.stopPropagation();
    this.api.deleteTask(this.task.id).subscribe({
      next: () => this.changed.emit()
    });
  }

  changeStatus(status: TaskStatus) {
    this.api.updateStatus(this.task.id, status).subscribe({
      next: () => this.changed.emit()
    });
  }

  get initials(): string {
    const n = (this.task.member?.name || '').trim();
    const s = (this.task.member?.surname || '').trim();
    const ini = (n[0] || '') + (s[0] || '');
    return ini.toUpperCase() || 'U';
  }

  get progressClass(): 'ok' | 'warn' | 'late' | 'unknown' {
    const dueMs   = this.task.dueDate   ? new Date(this.task.dueDate).getTime()   : NaN;
    const startMs = this.task.createdAt ? new Date(this.task.createdAt).getTime() : NaN;

    if (isNaN(dueMs)) return 'unknown';

    const start = isNaN(startMs) ? Date.now() : startMs;
    const end   = dueMs;

    if (end <= start) {
      return Date.now() > end ? 'late' : 'unknown';
    }

    const now = Date.now();
    if (now > end) return 'late';

    const total = end - start;
    const elapsed = now - start;
    const ratio = elapsed / total; // 0..1

    return ratio < 0.7 ? 'ok' : 'warn';
  }
}
