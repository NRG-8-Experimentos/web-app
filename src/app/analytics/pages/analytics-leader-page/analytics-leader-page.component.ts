import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsApiService } from '../../services/groups-api.service';
import { AnalyticsLeaderApiService } from '../../services/analytics-leader-api.service';
import { LeaderAnalyticsResource } from '../../models/analytics-leader.entity';
import {AnalyticsLeaderComponent} from '../../components/analytics-leader/analytics-leader.component';
import { MemberApiService } from '../../services/member-api.service';

@Component({
  selector: 'app-analytics-leader-page-page',
  templateUrl: './analytics-leader-page.component.html',
  styleUrls: ['./analytics-leader-page.component.css'],
  imports: [CommonModule, AnalyticsLeaderComponent]
})
export class AnalyticsLeaderPageComponent implements OnInit {
  loading: boolean = true;
  error: string | null = null;

  private groupsService = inject(GroupsApiService);
  private analyticsService = inject(AnalyticsLeaderApiService);
  private memberService = inject(MemberApiService);

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
  avgCompletionMembers: any[] = [];

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
        let timePassedSumMs = 0;

        const metricPromises = members.map(async (member: any) => {
          const memberId = member.id;
          const overviewData = await this.analyticsService.getTaskOverviewForMember(memberId).toPromise().catch(() => ({}));
          const details = overviewData?.details ?? {};
          overview.completed += details['COMPLETED'] ?? 0;
          overview.done += details['DONE'] ?? 0;
          overview.inProgress += details['IN_PROGRESS'] ?? 0;
          overview.pending += details['PENDING'] ?? 0;
          overview.overdue += details['OVERDUE'] ?? 0;

          // Usar getTasksForMember para la distribución y conteo de estados
          const memberTasks = await this.memberService.getTasksForMember(memberId).toPromise().catch(() => []);
          const taskCount = Array.isArray(memberTasks) ? memberTasks.length : 0;
          leaderTasks.push({
            memberName: member.name + ' ' + member.surname,
            imgUrl: member.imgUrl,
            taskCount: taskCount,
            title: member.title
          });

          // Contar tareas por estado usando memberTasks
          if (Array.isArray(memberTasks)) {
            overview.pending += memberTasks.filter(t => t.status === 'ON_HOLD').length;
            overview.inProgress += memberTasks.filter(t => t.status === 'IN_PROGRESS').length;
            overview.completed += memberTasks.filter(t => t.status === 'COMPLETED').length;
            overview.done += memberTasks.filter(t => t.status === 'DONE').length;
            overview.overdue += memberTasks.filter(t => t.status === 'EXPIRED').length;
          }

          const avgData = await this.analyticsService.getAvgCompletionTimeForMember(memberId).toPromise().catch(() => ({}));
          // console.log(`[Tiempo promedio][memberId=${memberId}]`, avgData); // <-- QUITAR LOG
          if (avgData?.value !== undefined) {
            const avgMinutes = Math.round(avgData.value * 24 * 60);
            avgCompletionSum += avgMinutes;
            avgCompletionCount++;
            this.avgCompletionMembers.push({
              name: member.name,
              surname: member.surname,
              imgUrl: member.imgUrl,
              avgMinutes: avgMinutes
            });
          }

          const rescheduledData = await this.analyticsService.getRescheduledTasksForMember(memberId).toPromise().catch(() => ({}));
          rescheduledSum += rescheduledData?.value ?? 0;
          member.rescheduledCount = rescheduledData?.value ?? 0;

          const timePassedData = await this.analyticsService.getTaskTimePassedForMember(memberId).toPromise().catch(() => ({}));
          timePassedSumMs += timePassedData?.timePassed ?? 0;
        });

        await Promise.all(metricPromises);

        this.membersWithRescheduled = members.filter(m => m.rescheduledCount && m.rescheduledCount > 0);

        this.analyticsResource.overview = overview;
        this.analyticsResource.leaderTasks = leaderTasks;
        const avgMinutes = avgCompletionCount ? Math.round(avgCompletionSum / avgCompletionCount) : 0;
        this.analyticsResource.avgCompletion = {
          avgDays: avgMinutes
        };
        this.analyticsResource.rescheduled = { rescheduled: rescheduledSum };
        this.analyticsResource.timePassed = { timePassed: Math.round(timePassedSumMs / 60000) }; // Suma en minutos
        this.avgCompletionMembers = this.avgCompletionMembers; // <-- Ya está actualizada, puedes omitir esta línea si lo prefieres

        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'No se pudieron cargar los miembros del grupo.';
        this.loading = false;
      }
    });
  }
}
