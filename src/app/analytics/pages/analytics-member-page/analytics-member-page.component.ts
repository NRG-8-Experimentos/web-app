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
  private memberApiService = inject(MemberApiService); // Inyecta el servicio de miembro
  member: Member | null = null;
  overview: any = {};
  loadingTasks: boolean = false;
  memberTasks: any[] = [];
  rescheduled: any = {};
  avgCompletion: any = {};

  private getData() {
    this.detailsService.getMemberDetails().subscribe((response: Member) => {
      this.member = response;
      const memberId = response.id;

      // Usar getTasksForMember para obtener todas las tareas y contar estados
      this.memberApiService.getTasksForMember(memberId).subscribe(memberTasks => {
        this.memberTasks = Array.isArray(memberTasks) ? memberTasks : [];
        // Contar tareas por estado
        this.overview.pending = this.memberTasks.filter(t => t.status === 'ON_HOLD').length;
        this.overview.inProgress = this.memberTasks.filter(t => t.status === 'IN_PROGRESS').length;
        this.overview.completed = this.memberTasks.filter(t => t.status === 'COMPLETED').length;
        this.overview.done = this.memberTasks.filter(t => t.status === 'DONE').length;
        this.overview.overdue = this.memberTasks.filter(t => t.status === 'EXPIRED').length;
        this.loadingTasks = false;
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
