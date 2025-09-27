import { Routes } from '@angular/router';
import {LogInComponent} from './iam/pages/log-in.component/log-in.component';
import {SignUpComponent} from './iam/pages/sign-up/sign-up.component';
import {MainMemberComponent} from './shared/pages/main-member/main-member.component';
import {MainLeaderComponent} from './shared/pages/main-leader/main-leader.component';
import {MainComponent} from './public/pages/main/main.component';
import {authGuard} from './iam/services/auth-guard';
import {MyGroupLeaderComponent} from './groups/pages/my-group-leader/my-group-leader.component';
import {MembersLeaderComponent} from './groups/pages/members-leader/members-leader.component';
import {InvitationsLeaderComponent} from './invitations/pages/invitations-leader/invitations-leader.component';
import {RequestsLeaderComponent} from './requests/pages/requests-leader/requests-leader.component';
import {TasksLeaderComponent} from './tasks/pages/tasks-leader/tasks-leader.component';
import {AnalyticsLeaderComponent} from './analytics/pages/analytics-leader/analytics-leader.component';
import {MyGroupMemberComponent} from './groups/pages/my-group-member/my-group-member.component';
import {TasksMemberComponent} from './tasks/pages/tasks-member/tasks-member.component';
import {RequestsMemberComponent} from './requests/pages/requests-member/requests-member.component';
import {AnalyticsMemberComponent} from './analytics/pages/analytics-member/analytics-member.component';
import {InvitationMemberComponent} from './invitations/pages/invitation-member/invitation-member.component';

export const routes: Routes = [
  {path: '', component: MainComponent, canActivate:[authGuard]},
  { path: 'sign-in', component: LogInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'members/main', component: MainMemberComponent },
  { path: 'leaders/main', component: MainLeaderComponent },
  { path: 'leaders/my-group', component: MyGroupLeaderComponent },
  { path: 'leaders/my-group/members', component: MembersLeaderComponent },
  { path: 'leaders/my-group/invitations', component: InvitationsLeaderComponent },
  { path: 'leaders/my-group/request-&-validations', component: RequestsLeaderComponent },
  { path: 'leaders/my-group/tasks', component: TasksLeaderComponent },
  { path: 'leaders/my-group/analytics', component: AnalyticsLeaderComponent },
  { path: 'members/my-group', component: MyGroupMemberComponent },
  { path: 'members/my-group/tasks', component: TasksMemberComponent },
  { path: 'members/my-group/request-&-validations', component: RequestsMemberComponent},
  { path: 'members/my-group/analytics', component: AnalyticsMemberComponent },
  { path: 'members/group-search', component: InvitationMemberComponent },
  { path: '**', redirectTo: '' }
];
