export interface TaskTimePassedResource {
  memberId: number;
  avgTimePassedMillis: number;
}

export interface AvgCompletionTimeResource {
  type: string;
  avgDays: number;
  details: { [key: string]: number };
}

export interface RescheduledTasksResource {
  type: string;
  totalRescheduled: number;
  details: { [key: string]: number };
  rescheduledMemberIds: number[];
}

export interface MemberTaskInfo {
  memberName: string;
  taskCount: number;
  imgUrl?: string;
}

export interface TaskDistributionResource {
  type: string;
  totalTasks: number;
  details: { [memberId: string]: MemberTaskInfo };
}

export interface TaskOverviewResource {
  type: string;
  totalTasks: number;
  overview: { [status: string]: number };
}
