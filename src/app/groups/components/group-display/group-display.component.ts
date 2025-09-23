import { Component } from '@angular/core';
import {NoGroupDisplayComponent} from '../no-group-display/no-group-display.component';
/*
* .user-pfp{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.25rem 0;
  border-bottom: 2px solid #ffffff;


}*/
@Component({
  selector: 'app-group-display',
  imports: [
    NoGroupDisplayComponent
  ],
  template: `
    <div class="w-full h-full">
      @if (hasGroup){
        <div class="w-full h-full grid grid-cols-2">
          <div>
            <h2 class="text-2xl font-bold">Grupo</h2>
            <div class="max-w-xs">
              <div class="flex  items-center justify-between gap-6">
                <img src="assets/images/group.jpg" alt="Group Picture" class="w-36 h-36 rounded-full object-cover shadow-md shadow-gray-800"/>
                <h3 class="text-2xl font-medium"> {{ groupName }}</h3>
              </div>
            </div>
            <div>

            </div>
            <div>

            </div>
          </div>
          <div>
            <h2 class="text-2xl font-bold">Miembros</h2>
          </div>
        </div>
      } @else {
        <h2 class="text-2xl font-bold">Grupo</h2>
        <app-no-group-display/>
      }
    </div>
  `,
  styles: ``
})
export class GroupDisplayComponent {
  groupName = "Los Backyardigans";
  groupCode = "345D76SF7";
  groupDescription = "\"Los Backyardigans\" es un equipo de trabajo cohesionado y multifuncional, especializado en soluciones logísticas, desarrollo de proyectos creativos y análisis de datos.";

  hasGroup = true;

}
