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
    console.log('getData called');
    this.detailsService.getMemberDetails().subscribe((response: Member) => {
      this.member = response;
      console.log('Member details fetched successfully:', this.member);

      if (this.member?.id) {
        this.metricsService.getTaskOverviewForMember(this.member.id).subscribe(data => {
          const overviewData = data as any;
          console.log('Overview data:', overviewData);
          console.log('Overview details:', overviewData.details);
          const details = overviewData.details ?? {};
          this.overview = {
            completed: details['COMPLETED'] ?? 0,
            done: details['DONE'] ?? 0,
            inProgress: details['IN_PROGRESS'] ?? 0,
            pending: details['PENDING'] ?? 0,
            overdue: details['OVERDUE'] ?? 0
          };
          console.log('Overview mapped:', this.overview);
        });

        this.loadingTasks = true;
        this.metricsService.getTaskDistributionForMember(this.member.id).subscribe(data => {
          const distributionData = data as any;
          console.log('Task distribution data:', distributionData);
          console.log('Task distribution details:', distributionData.details);
          // El objeto tiene la estructura { [memberId]: { tasks: [...] } }
          let memberDetails = undefined;
          if (this.member && distributionData.details) {
            memberDetails = distributionData.details[this.member.id];
          }
          this.memberTasks = Array.isArray(memberDetails?.tasks) ? memberDetails.tasks : [];
          console.log('Mapped memberTasks:', this.memberTasks);
          this.loadingTasks = false;
        }, err => {
          console.error('Error loading member tasks:', err);
          this.loadingTasks = false;
        });

        this.metricsService.getRescheduledTasksForMember(this.member.id).subscribe(data => {
          const rescheduledData = data as any;
          console.log('Rescheduled data:', rescheduledData);
          this.rescheduled = { rescheduled: rescheduledData.value ?? 0 };
        });

        this.metricsService.getAvgCompletionTimeForMember(this.member.id).subscribe(data => {
          const avgCompletionData = data as any;
          console.log('Avg completion data:', avgCompletionData);
          // Convierte días decimales a minutos y muestra como entero
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
    console.log('ngOnInit called');
    this.getData();
  }
}
