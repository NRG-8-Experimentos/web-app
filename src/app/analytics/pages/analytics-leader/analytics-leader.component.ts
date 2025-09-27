import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  TaskOverviewResource,
  TaskDistributionResource,
  RescheduledTasksResource,
  AvgCompletionTimeResource
} from '../../models/metrics.models';

@Component({
  selector: 'app-analytics-leader',
  templateUrl: './analytics-leader.component.html',
  styleUrls: ['./analytics-leader.component.css'],
  imports: [CommonModule]
})
export class AnalyticsLeaderComponent implements OnInit {
  loading = false;
  errorMsg = '';
  overview?: TaskOverviewResource;
  distribution?: TaskDistributionResource;
  rescheduled?: RescheduledTasksResource;
  avgCompletion?: AvgCompletionTimeResource;
  token: string = '';
  defaultProfileUrl = 'https://ui-avatars.com/api/?background=1A4E85&color=fff&name=User';

  ngOnInit(): void {
    // Simulación de datos con imgUrl
    this.overview = {
      type: 'overview',
      totalTasks: 42,
      overview: {
        'COMPLETED': 30,
        'IN_PROGRESS': 12
      }
    };
    this.distribution = {
      type: 'distribution',
      totalTasks: 42,
      details: {
        '1': { memberName: 'Ana Pérez', taskCount: 15, imgUrl: 'https://randomuser.me/api/portraits/women/1.jpg' },
        '2': { memberName: 'Luis Gómez', taskCount: 10, imgUrl: 'https://randomuser.me/api/portraits/men/2.jpg' },
        '3': { memberName: 'María López', taskCount: 7, imgUrl: 'https://randomuser.me/api/portraits/women/3.jpg' },
        '4': { memberName: 'Carlos Ruiz', taskCount: 5, imgUrl: 'https://randomuser.me/api/portraits/men/4.jpg' },
        '5': { memberName: 'Sofía Torres', taskCount: 5, imgUrl: 'https://randomuser.me/api/portraits/women/5.jpg' }
      }
    };
    this.rescheduled = {
      type: 'rescheduled',
      totalRescheduled: 6,
      details: { 'rescheduled': 6, 'total': 42 },
      rescheduledMemberIds: [1, 3, 5]
    };
    this.avgCompletion = undefined; // Simula error en tiempo promedio
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  trackByMemberId(index: number, memberId: string): string {
    return memberId;
  }

  getBarWidth(taskCount?: number): number {
    if (!this.distribution?.details) return 0;
    const counts = Object.values(this.distribution.details).map((info: any) => info.taskCount || 0);
    const max = Math.max(...counts, 1);
    return taskCount && max ? Math.round((taskCount / max) * 100) : 0;
  }

  getMemberImgUrl(memberId: number): string | undefined {
    const member = this.distribution?.details?.[memberId];
    return member?.imgUrl;
  }
}
