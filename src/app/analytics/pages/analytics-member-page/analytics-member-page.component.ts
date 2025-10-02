import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsService } from '../../../shared/services/details.service';
import { Member } from '../../../shared/model/member.entity';
import { AnalyticsLeaderApiService } from '../../services/analytics-leader-api.service';
import { AnalyticsMemberComponent } from '../../components/analytics-member/analytics-member.component';
import { MemberApiService } from '../../services/member-api.service';

@Component({
  selector: 'app-analytics-member-page',
  standalone: true,
  imports: [CommonModule, AnalyticsMemberComponent],
  templateUrl: './analytics-member-page.component.html',
  styleUrl: './analytics-member-page.component.css'
})
export class AnalyticsMemberPageComponent {
  private detailsService = inject(DetailsService);
  private leaderMetricsService = inject(AnalyticsLeaderApiService);
  private memberApiService = inject(MemberApiService);
  member: Member | null = null;
  overview: any = {};
  loadingTasks: boolean = false;
  memberTasks: any[] = [];
  rescheduled: any = {};
  avgCompletion: any = {};
  totalInProgressDuration: number = 0;
  inProgressTaskDurations: { taskId: number, title: string, duration: number }[] = [];

  private getData() {
    this.detailsService.getMemberDetails().subscribe((response: Member) => {
      this.member = response;
      const memberId = response.id;

      this.memberApiService.getTasksForMember(memberId).subscribe(memberTasks => {
        this.memberTasks = Array.isArray(memberTasks) ? memberTasks : [];
        this.overview.pending = this.memberTasks.filter(t => t.status === 'ON_HOLD').length;
        this.overview.inProgress = this.memberTasks.filter(t => t.status === 'IN_PROGRESS').length;
        this.overview.completed = this.memberTasks.filter(t => t.status === 'COMPLETED').length;
        this.overview.done = this.memberTasks.filter(t => t.status === 'DONE').length;
        this.overview.overdue = this.memberTasks.filter(t => t.status === 'EXPIRED').length;
        this.loadingTasks = false;

        // Nueva lógica para sumar duración de tareas IN_PROGRESS y guardar cada duración
        const inProgressTasks = this.memberTasks.filter(t => t.status === 'IN_PROGRESS');
        this.inProgressTaskDurations = [];
        if (inProgressTasks.length > 0) {
          let durations: number[] = [];
          let completed = 0;
          this.totalInProgressDuration = 0;
          inProgressTasks.forEach(task => {
            this.leaderMetricsService.getInProgressTaskDuration(task.id).subscribe(data => {
              const duration = typeof data.durationInHours === 'number' ? data.durationInHours : 0;
              durations.push(duration);
              this.inProgressTaskDurations.push({
                taskId: task.id,
                title: task.title,
                duration
              });
              completed++;
              if (completed === inProgressTasks.length) {
                this.totalInProgressDuration = durations.reduce((a, b) => a + b, 0);
              }
            }, _ => {
              completed++;
              if (completed === inProgressTasks.length) {
                this.totalInProgressDuration = durations.reduce((a, b) => a + b, 0);
              }
            });
          });
        } else {
          this.totalInProgressDuration = 0;
          this.inProgressTaskDurations = [];
        }
      }, err => {
        this.memberTasks = [];
        this.loadingTasks = false;
        console.error(
          'Error en api/v1/member/tasks: Verifica que la ruta exista en el backend y que el proxy/conf esté correctamente configurado.'
        );
        if (err && err.error) {
          console.error('Error body:', err.error);
        }
      });

      this.leaderMetricsService.getRescheduledTasksForMember(memberId).subscribe(data => {
        const rescheduledData = data as any;
        this.rescheduled = { rescheduled: rescheduledData.value ?? 0 };
      });

      this.leaderMetricsService.getAvgCompletionTimeForMember(memberId).subscribe(data => {
        const avgCompletionData = data as any;
        const minutes = avgCompletionData.value !== undefined ? Math.round(avgCompletionData.value * 24 * 60) : 0;
        this.avgCompletion = { avgDays: minutes };
      });
    });
  }

  formatAvgCompletionTime(minutes: number): string {
    return `${minutes} minutos`;
  }

  formatInProgressDuration(hours: number): string {
    if (hours < 1) {
      const mins = Math.round(hours * 60);
      return `${mins} minutos`;
    }
    const days = Math.floor(hours / 24);
    const remHours = Math.floor(hours % 24);
    let result = '';
    if (days > 0) {
      result += `${days} ${days === 1 ? 'día' : 'días'}`;
    }
    if (remHours > 0) {
      if (result.length > 0) result += ' ';
      result += `${remHours} ${remHours === 1 ? 'hora' : 'horas'}`;
    }
    if (result === '') {
      result = '0 horas';
    }
    return result;
  }

  ngOnInit(): void {
    this.getData();
  }
}
