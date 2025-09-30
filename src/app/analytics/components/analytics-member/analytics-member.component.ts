import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Member } from '../../../shared/model/member.entity';

@Component({
  selector: 'app-analytics-member',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-member.component.html',
  styleUrl: './analytics-member.component.css'
})
export class AnalyticsMemberComponent {
  @Input() member: Member | null = null;
  @Input() overview: any = {};
  @Input() loadingTasks: boolean = false;
  @Input() memberTasks: any[] = [];
  @Input() rescheduled: any = {};
  @Input() avgCompletion: any = {};
  @Input() formatAvgCompletionTime!: (minutes: number) => string;
}
