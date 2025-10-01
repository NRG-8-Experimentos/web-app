import { Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Task, TaskStatus } from '../../model/task.model';
import { TasksApiService } from '../../services/tasks-api.service';

@Component({
  selector: 'member-task-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './member-task-item.html',
  styleUrls: ['./member-task-item.css']
})
export class MemberTaskItemComponent implements OnChanges {
  @Input({ required: true }) task!: Task;
  @Output() changed = new EventEmitter<void>();

  protected api = inject(TasksApiService);
  private router = inject(Router);

  TaskStatus = TaskStatus;
  remainingLabel = '—';

  ngOnChanges(_: SimpleChanges) { this.computeStatics(); }

  private computeStatics() {
    const end = this.task?.dueDate ? new Date(this.task.dueDate).getTime() : NaN;
    const now = Date.now();
    if (!isNaN(end)) {
      const diff = Math.max(end - now, 0);
      const d = Math.floor(diff / (24 * 60 * 60 * 1000));
      const h = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const m = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      this.remainingLabel = `${d}d:${String(h).padStart(2, '0')}hrs:${String(m).padStart(2, '0')}min`;
    } else {
      this.remainingLabel = '—';
    }
  }

  get progressClass(): 'ok' | 'warn' | 'late' | 'unknown' {
    const dueMs   = this.task?.dueDate   ? new Date(this.task.dueDate).getTime()   : NaN;
    const startMs = this.task?.createdAt ? new Date(this.task.createdAt).getTime() : NaN;
    if (isNaN(dueMs)) return 'unknown';
    const start = isNaN(startMs) ? Date.now() : startMs;
    const end   = dueMs;
    if (end <= start) return Date.now() > end ? 'late' : 'unknown';
    const now = Date.now();
    if (now > end) return 'late';
    const ratio = (now - start) / (end - start);
    return ratio < 0.7 ? 'ok' : 'warn';
  }

  open() {
    this.router.navigate(['/members/my-group/tasks', this.task.id], { state: { from: 'member' } });
  }

  markInProgress(ev?: Event) {
    ev?.stopPropagation();
    this.api.updateStatus(this.task.id, TaskStatus.IN_PROGRESS).subscribe({ next: () => this.changed.emit() });
  }

  markDone(ev?: Event) {
    ev?.stopPropagation();
    this.api.updateStatus(this.task.id, TaskStatus.DONE).subscribe({ next: () => this.changed.emit() });
  }
}
