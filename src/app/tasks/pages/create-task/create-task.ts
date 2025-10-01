import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TasksApiService } from '../../services/tasks-api.service';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-task.html',
  styleUrls: ['./create-task.css']
})
export class CreateTaskComponent {
  title = '';
  description = '';
  dueDate = '';
  memberId?: number;

  private router = inject(Router);
  private api = inject(TasksApiService);

  saving = false;

  save() {
    if (!this.title.trim()) {
      alert('El título es obligatorio.');
      return;
    }
    if (!this.dueDate) {
      alert('La fecha de vencimiento es obligatoria.');
      return;
    }

    this.saving = true;

    const dateISO = new Date(`${this.dueDate}T00:00:00`).toISOString();


    const payload = {
      title: this.title.trim(),
      description: this.description?.trim() || undefined,
      dueDate: dateISO,
      memberId: this.memberId ?? undefined,
    };


    this.api.createTask(payload).subscribe({
      next: () => this.router.navigate(['/leaders/my-group/tasks']),
      error: (err) => {
        console.error('Error creando tarea', err);
        alert('No se pudo crear la tarea. Intenta nuevamente.');
        this.saving = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/leaders/my-group/tasks']);
  }
}
