import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsService } from '../../../shared/services/details.service';
import { Member } from '../../../shared/model/member.entity';
import { MetricsService } from '../../services/metrics.service'; // Asegúrate de tener este servicio

@Component({
  selector: 'app-analytics-member',
  imports: [CommonModule],
  templateUrl: './analytics-member.component.html',
  styleUrl: './analytics-member.component.css'
})
export class AnalyticsMemberComponent {
  private detailsService = inject(DetailsService);
  private metricsService = inject(MetricsService); // Inyecta el servicio de métricas
  member: Member | null = null;

  // Declaración mínima de propiedades requeridas por el template
  overview: any = {};
  loadingTasks: boolean = false;
  memberTasks: any[] = [];
  rescheduled: any = {};
  avgCompletion: any = {};

  private getData() {
    this.detailsService.getMemberDetails().subscribe((response: Member) => {
      this.member = response;

      if (this.member?.id) {
        this.metricsService.getTaskOverviewForMember(this.member.id).subscribe(data => {
          const overviewData = data as any;
          const details = overviewData.details ?? {};
          this.overview = {
            completed: details['COMPLETED'] ?? 0,
            done: details['DONE'] ?? 0,
            inProgress: details['IN_PROGRESS'] ?? 0,
            pending: details['PENDING'] ?? 0,
            overdue: details['OVERDUE'] ?? 0
          };
        });

        this.loadingTasks = true;
        this.metricsService.getMemberTasks(this.member.id).subscribe(data => {
          if (Array.isArray(data)) {
            this.memberTasks = data;
          } else if (data && Array.isArray(data.tasks)) {
            this.memberTasks = data.tasks;
          } else if (data && Array.isArray(data.result)) {
            this.memberTasks = data.result;
          } else {
            this.memberTasks = [];
          }
          this.loadingTasks = false;
        }, err => {
          this.loadingTasks = false;
          // Mensaje claro para depuración
          console.error(
            'Error en api/v1/member/tasks: El endpoint está devolviendo HTML en vez de JSON. ' +
            'Verifica que la ruta exista en el backend y que el proxy/conf esté correctamente configurado.'
          );
          if (err && err.error) {
            console.error('Error body:', err.error);
          }
        });

        this.metricsService.getRescheduledTasksForMember(this.member.id).subscribe(data => {
          const rescheduledData = data as any;
          this.rescheduled = { rescheduled: rescheduledData.value ?? 0 };
        });

        this.metricsService.getAvgCompletionTimeForMember(this.member.id).subscribe(data => {
          const avgCompletionData = data as any;
          const minutes = avgCompletionData.value !== undefined ? Math.round(avgCompletionData.value * 24 * 60) : 0;
          this.avgCompletion = { avgDays: minutes };
        });
      }
    }, error => {
      console.error('There was an error fetching member details!', error);
    });
  }

  formatAvgCompletionTime(minutes: number): string {
    return `${minutes} minutos`;
  }

  ngOnInit(): void {
    this.getData();
  }
}
