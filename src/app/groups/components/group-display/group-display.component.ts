import { Component } from '@angular/core';
import {NoGroupDisplayComponent} from '../no-group-display/no-group-display.component';

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
            <div>

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
