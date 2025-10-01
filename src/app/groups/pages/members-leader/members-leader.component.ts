import { Component, OnInit } from '@angular/core';
import {MemberGroupService} from '@app/groups/services/member-group.service';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NgForOf, NgIf, NgStyle} from '@angular/common';

@Component({
  selector: 'app-members-leader',
  template: `
    <div style="margin: 2rem; text-align: center;">
      <ng-container *ngIf="!selectedMember; else memberDetail">
        <h2>Integrantes</h2>
        <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 32px;">
          <mat-card *ngFor="let member of members"
                    style="width: 350px; margin: 16px; border-radius: 24px; box-shadow: 0px 2px 10px #ddd; cursor:pointer; display: flex; flex-direction: column; align-items: center;"
                    (click)="selectMember(member)">
            <mat-card-header style="width: 100%; display: flex; align-items: center;">
              <div mat-card-avatar>
                <img *ngIf="member.imgUrl" [src]="member.imgUrl" style="width: 48px; border-radius: 50%;"/>
              </div>
              <mat-card-title style="margin-left: 12px; text-align: left; flex:1;">{{ member.name }} {{ member.surname }}</mat-card-title>
            </mat-card-header>
            <mat-card-content style="width: 100%;">
              <div style="background: #174370; color: white; padding: 18px; border-radius: 18px;">
                <div style="font-weight:700; font-size: 1.3em;">Tarea 1</div>
                <div>Descripción tarea 1</div>
              </div>
            </mat-card-content>
            <div style="height: 7px; border-radius: 10px; width: 95%; margin: auto; margin-top: 10px;"
                 [ngStyle]="{ 'background': getColor(member) }"></div>
            <div style="text-align: center; font-size: 0.95em;">
              XX/XX/XXXX - XX/XX/XXXX
            </div>
          </mat-card>
        </div>
      </ng-container>

      <ng-template #memberDetail>
        <button mat-button color="primary" (click)="selectedMember = null" style="margin-bottom: 20px;">
          ← Regresar
        </button>
        <h1>{{ selectedMember.name }} {{ selectedMember.surname }}</h1>
        <div style="display: flex; justify-content: center; gap: 32px; flex-wrap: wrap;">
          <mat-card *ngFor="let task of tasks"
                    style="width: 500px; border-radius: 32px; min-height:340px; background: #f8f8f8; text-align: left;">
            <div style="padding: 28px 32px;">
              <div style="font-size: 1.6em; font-weight: 700;">{{ task.title }}</div>
              <hr style="margin: 10px 0;">
              <div style="padding: 16px 12px; border-radius: 18px; background: #fff; font-size: 1.12em; font-weight: 600; min-height:70px; box-shadow: 0 2px 8px #ddd;">
                {{ task.description }}
              </div>
              <div style="height: 13px; border-radius: 10px; margin: 18px 0 4px 0;"
                   [ngStyle]="{ 'background': getTaskColor(task.status) }"></div>
              <div style="text-align:center;font-size:1em;">{{ task.dueDate }} </div>
            </div>
          </mat-card>
        </div>
      </ng-template>
    </div>
  `,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButtonModule,
    MatIconModule,
    NgStyle,
    NgForOf,
    NgIf
  ],
  styles: []
})
export class MembersLeaderComponent implements OnInit {
  members: any[] = [];
  selectedMember: any = null;
  tasks: any[] = [];

  constructor(private memberGroupService: MemberGroupService) {}

  ngOnInit() {
    this.memberGroupService.getMemberGroup().subscribe(data => {
      this.members = data.members || [];
    });
  }

  selectMember(member: any) {
    this.selectedMember = member;
    this.memberGroupService.getMemberTasks(member.id).subscribe(tasks => {
      this.tasks = tasks || [];
    }, () => {
      this.tasks = [];
    });
  }

  getColor(member: any): string {
    if (member.name === 'Alissa') return 'linear-gradient(to right, #61ce70 90%, #61ce70 100%)';
    if (member.name === 'Jose') return 'linear-gradient(to right, #f6da49 90%, #f6da49 100%)';
    return 'linear-gradient(to right, #ee3e34 90%, #ee3e34 100%)';
  }

  getTaskColor(status: string): string {
    switch(status.toLowerCase()) {
      case 'finalized': return 'linear-gradient(to right, #61ce70 100%, #61ce70 100%)';
      case 'pending': return 'linear-gradient(to right, #f6da49 100%, #f6da49 100%)';
      case 'overdue': return 'linear-gradient(to right, #ee3e34 100%, #ee3e34 100%)';
      default: return 'linear-gradient(to right, #999 100%, #999 100%)';
    }
  }
}
