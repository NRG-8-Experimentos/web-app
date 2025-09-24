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
        <div class="w-full h-full grid grid-cols-2 gap-16">
          <div class="w-full h-full flex flex-col gap-7">
            <h2 class="text-2xl font-bold">Grupo</h2>

            <div class="flex">
              <div class="max-w-md flex items-center justify-between gap-6">
                <img src="assets/images/group.jpg" alt="Group Picture" class="w-36 h-36 rounded-full object-cover shadow-md shadow-gray-800"/>
                <h3 class="text-2xl font-medium"> {{ groupName }}</h3>
              </div>
            </div>

            <div class="text-white flex justify-center items-center">
              <div class="bg-[#4A90E2] rounded-2xl py-2 px-6 text-xl">
                #{{ groupCode}}
              </div>
            </div>
            <div class="w-full flex-1">
              <div class="w-full h-full rounded-3xl bg-[#1A4E85] p-8 text-white text-center text-2xl flex items-center">
                {{ groupDescription }}
              </div>
            </div>
          </div>
          <div class="h-full flex flex-col gap-7">
            <h2 class="text-2xl font-bold">Miembros</h2>
            <div class="flex-1 w-full h-full rounded-3xl bg-[#1A4E85] p-8 text-white text-center text-2xl ">
              Tu grupo no tiene integrantes, brindale el código a tus compañeros de proyecto para poder unirse al grupo
            </div>
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
