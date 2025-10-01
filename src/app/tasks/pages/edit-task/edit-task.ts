import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksApiService, Task } from '../../services/tasks-api.service';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-task.html',
  styleUrls: ['./edit-task.css']
})
export class EditTaskComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(TasksApiService);

  taskId!: number;

  // Campos editables
  title = '';
  description = '';
  memberId?: number;
  dueDate = ''; // YYYY-MM-DD para el <input type="date">

  loading = true;
  saving = false;

  ngOnInit() {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.taskId) {
      alert('ID de tarea inválido');
      this.router.navigate(['/leaders/my-group/tasks']);
      return;
    }

    this.api.getById(this.taskId).subscribe({
      next: (t: Task) => {
        this.title = t.title ?? '';
        this.description = t.description ?? '';
        this.memberId = t.member?.id ?? (t as any).memberId;
        this.dueDate = t.dueDate ? (t.dueDate.split('T')[0]) : '';
        this.loading = false;
      },
      error: () => {
        alert('No se pudo cargar la tarea.');
        this.router.navigate(['/leaders/my-group/tasks']);
      }
    });
  }

  save() {
    if (!this.title.trim()) {
      alert('El título es obligatorio');
      return;
    }
    this.saving = true;

    const payload = {
      title: this.title.trim(),
      description: this.description?.trim() || undefined,
      memberId: this.memberId ?? undefined,
      // backend espera OffsetDateTime -> mandamos ISO
      dueDate: this.dueDate ? `${this.dueDate}T00:00:00Z` : undefined,
    };

    this.api.updateTask(this.taskId, payload).subscribe({
      next: () => this.router.navigate(['/leaders/my-group/tasks']),
      error: (err) => {
        console.error('Error actualizando tarea', err);
        alert('No se pudo actualizar la tarea. Inténtalo de nuevo.');
        this.saving = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/leaders/my-group/tasks']);
  }
}
