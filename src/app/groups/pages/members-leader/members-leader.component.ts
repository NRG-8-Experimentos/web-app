import { Component, OnInit } from '@angular/core';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { GroupService } from '@app/groups/services/group.service';
import { ShortMember } from '@app/shared/model/short-member.entity';
import { Router } from '@angular/router';
import { Task } from '@app/shared/model/task.entity';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-members-leader',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, MatCardModule, MatIconModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-6">Integrantes</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <mat-card
          *ngFor="let member of members; let idx = index"
          class="rounded-2xl shadow-lg bg-gray-50 px-2 py-2"
          style="cursor:pointer;"
          (click)="goToTaskDetails(member.id)"
        >
          <div class="flex items-center px-3 pt-3 pb-2">
            <img [src]="member.imgUrl" alt="{{member.name}}" class="w-10 h-10 rounded-full mr-3 border-2 border-white shadow" />
            <span class="font-semibold text-lg">{{ member.name }} {{ member.surname }}</span>
          </div>
          <ng-container *ngIf="member.task">
            <div class="rounded-xl shadow bg-[#1e4677] mt-2 mb-2 mx-3 px-4 py-4 text-white">
              <div class="text-lg font-medium mb-1">{{ member.task.title }}</div>
              <hr class="my-1 border-blue-500 border-opacity-50">
              <div class="text-base">{{ member.task.description }}</div>
            </div>
            <div class="mt-3 mx-6 h-2.5 rounded-full bg-green-400"></div>
            <div class="text-xs text-center tracking-wider mt-1 mb-2">{{ member.task.dueDate | date:'shortDate' }}</div>
          </ng-container>
          <ng-container *ngIf="!member.task">
            <div class="rounded-xl shadow bg-gray-200 mt-2 mb-2 mx-3 px-4 py-4 text-gray-600">Sin tareas</div>
          </ng-container>
        </mat-card>
      </div>
      <ng-template #noMembers>
        <p>No hay integrantes para mostrar.</p>
      </ng-template>
    </div>
  `
})
export class MembersLeaderComponent implements OnInit {
  members: (ShortMember & { task?: Task })[] = [];

  constructor(private groupService: GroupService, private router: Router) {}

  goToTaskDetails(memberId: number) {
    this.router.navigate([`/leaders/my-group/members/${memberId}/tasks`]);
  }

  ngOnInit() {
    const groupId = 1; // Asegúrate de usar el groupId correcto
    forkJoin({
      members: this.groupService.getGroupMembers(),
      tasks: this.groupService.getAllTasksByGroupId(groupId)
    }).subscribe({
      next: ({members, tasks}) => {
        this.members = members.map(member => ({
          ...member,
          // Busca la tarea correspondiente al miembro según la estructura real
          task: tasks.find(task => task.member && task.member.id === member.id)
        }));
      },
      error: (error) => {
        console.error('Error al obtener integrantes o tareas', error);
      }
    });
  }
}
