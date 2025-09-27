import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsApiService } from '../../services/groups-api.service';
import { AnalyticsLeaderApiService } from '../../services/analytics-leader-api.service';
import { LeaderAnalyticsResource } from '../../models/analytics-leader.entity';
import { AnalyticsLeaderComponent } from '../../components/analytics-leader/analytics-leader.component';

@Component({
  selector: 'app-analytics-leader-page',
  templateUrl: './analytics-leader-page.component.html',
  styleUrls: ['./analytics-leader-page.component.css'],
  imports: [CommonModule, AnalyticsLeaderComponent]
})
export class AnalyticsLeaderPageComponent implements OnInit {
  loading: boolean = true;
  error: string | null = null;

  private groupsService = inject(GroupsApiService);
  private analyticsService = inject(AnalyticsLeaderApiService);

  analyticsResource: LeaderAnalyticsResource = new LeaderAnalyticsResource(
    {} as any,
    [],
    {},
    [],
    {},
    {},
    {}
  );

  membersWithRescheduled: any[] = [];

  ngOnInit(): void {
    this.loading = true;
    this.groupsService.getAllGroupMembers().subscribe({
      next: async (membersData: any) => {
        if (!membersData || (membersData.error && membersData.status)) {
          this.error = 'No se pudieron cargar los miembros del grupo (respuesta inválida).';
          this.loading = false;
          return;
        }

        const members = Array.isArray(membersData) ? membersData : (membersData?.result ?? []);
        if (!Array.isArray(members) || members.length === 0) {
          this.error = 'No se encontraron miembros en el grupo.';
          this.loading = false;
          return;
        }

        this.analyticsResource.members = members;

        let overview = {
          completed: 0, done: 0, inProgress: 0, pending: 0, overdue: 0
        };
        let leaderTasks: any[] = [];
        let avgCompletionSum = 0;
        let avgCompletionCount = 0;
        let rescheduledSum = 0;
        let timePassedSum = 0;

        const metricPromises = members.map(async (member: any) => {
          const memberId = member.id;
          const overviewData = await this.analyticsService.getTaskOverviewForMember(memberId).toPromise().catch(() => ({}));
          const details = overviewData?.details ?? {};
          overview.completed += details['COMPLETED'] ?? 0;
          overview.done += details['DONE'] ?? 0;
          overview.inProgress += details['IN_PROGRESS'] ?? 0;
          overview.pending += details['PENDING'] ?? 0;
          overview.overdue += details['OVERDUE'] ?? 0;

          const distData = await this.analyticsService.getTaskDistributionForMember(memberId).toPromise().catch(() => []);
          const taskCount = Array.isArray(distData) ? distData.length : (distData?.tasks?.length ?? distData?.result?.length ?? 0);
          leaderTasks.push({
            memberName: member.name + ' ' + member.surname,
            imgUrl: member.imgUrl,
            taskCount: taskCount,
            title: member.title
          });

          const avgData = await this.analyticsService.getAvgCompletionTimeForMember(memberId).toPromise().catch(() => ({}));
          if (avgData?.value !== undefined) {
            avgCompletionSum += Math.round(avgData.value * 24 * 60);
            avgCompletionCount++;
          }

          const rescheduledData = await this.analyticsService.getRescheduledTasksForMember(memberId).toPromise().catch(() => ({}));
          rescheduledSum += rescheduledData?.value ?? 0;
          member.rescheduledCount = rescheduledData?.value ?? 0;

          const timePassedData = await this.analyticsService.getTaskTimePassedForMember(memberId).toPromise().catch(() => ({}));
          timePassedSum += timePassedData?.value ?? 0;
        });

        await Promise.all(metricPromises);

        this.membersWithRescheduled = members.filter(m => m.rescheduledCount && m.rescheduledCount > 0);

        this.analyticsResource.overview = overview;
        this.analyticsResource.leaderTasks = leaderTasks;
        this.analyticsResource.avgCompletion = { avgDays: avgCompletionCount ? Math.round(avgCompletionSum / avgCompletionCount) : 0 };
        this.analyticsResource.rescheduled = { rescheduled: rescheduledSum };
        this.analyticsResource.timePassed = { timePassed: timePassedSum };

        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'No se pudieron cargar los miembros del grupo.';
        this.loading = false;
      }
    });
  }
}
