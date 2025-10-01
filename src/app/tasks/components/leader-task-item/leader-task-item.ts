import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Task, TaskStatus } from '../../model/task.model';
import { TasksApiService } from '../../services/tasks-api.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog';

@Component({
  selector: 'leader-task-item',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './leader-task-item.html',
  styleUrls: ['./leader-task-item.css']
})
export class LeaderTaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() changed = new EventEmitter<void>();

  protected api = inject(TasksApiService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  open() {
    this.router.navigate(['/leaders/my-group/tasks', this.task.id]);
  }

  edit(ev?: Event) {
    ev?.stopPropagation();
    this.router.navigate(['/leaders/my-group/tasks', this.task.id, 'edit']);
  }

  confirmRemove(ev?: Event) {
    ev?.stopPropagation();
    const ref = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        title: 'Delete Task',
        message: `Are you sure you want to delete "${this.task.title}"?`
      }
    });
    ref.afterClosed().subscribe(yes => {
      if (yes) {
        this.api.deleteTask(this.task.id).subscribe({ next: () => this.changed.emit() });
      }
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
    const ratio = elapsed / total;

    return ratio < 0.7 ? 'ok' : 'warn';
  }
}
