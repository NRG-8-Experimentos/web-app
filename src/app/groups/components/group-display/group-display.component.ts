import { Component } from '@angular/core';
import {NoGroupDisplayComponent} from '../no-group-display/no-group-display.component';
import {
  ProfileImageDisplayComponent
} from '@app/shared/components/profile-image-display/profile-image-display.component';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-group-display',
  imports: [
    NoGroupDisplayComponent,
    ProfileImageDisplayComponent,
    MatIconModule
  ],
  template: `
    <div class="w-full h-full">
      @if (hasGroup){
        <div class="w-full h-full grid grid-cols-2 gap-16">
          <div class="w-full h-full flex flex-col gap-7">
            <h2 class="text-2xl font-bold">Grupo</h2>

            <app-profile-image-display [groupName]="groupName" alt="Imagen del grupo" imgSrc="assets/images/group.jpg"/>

            <div class="text-white flex justify-center items-center">
              <div class="bg-[#4A90E2] rounded-2xl py-2 px-6 text-xl">
                #{{ groupCode}}
              </div>
            </div>
            <div class="w-full flex-1">
              <div class="w-full h-full rounded-3xl bg-[#1A4E85] p-8 text-white text-center text-xl flex items-center">
                {{ groupDescription }}
              </div>
            </div>
          </div>
          <div class="h-full flex flex-col gap-7">
            <h2 class="text-2xl font-bold">Miembros</h2>
            @if (members.length > 0) {
              <div class="flex-1  rounded-3xl bg-[#F4F4F4] p-8 text-black text-center text-xl ">
                <div class="bg-white rounded-2xl h-full">
                  <div class="flex flex-col p-4 gap-4 h-full ">

                    @for (member of members; track member.id) {
                      <div class="flex justify-between items-center">
                        <div class="inline mb-4 md:mb-0 md:flex items-center ">
                          <img [src]="member.imgSrc" [alt]="member.name"
                               class="aspect-square rounded-full w-13 object-cover shadow-md shadow-gray-800 mr-4" />
                          <h3 class="text-md font-medium"> {{ member.name }} </h3>
                        </div>
                        <button class="bg-gray-300 flex items-center px-1 py-2 rounded hover:bg-red-400">
                          <mat-icon aria-hidden="false" aria-label="delete" fontIcon="delete" />
                        </button>
                      </div>
                    }

                  </div>
                </div>
              </div>
            } @else {
              <div class="flex-1 w-full h-full rounded-3xl bg-[#1A4E85] p-8 text-white text-center text-xl ">
                Tu grupo no tiene integrantes, brindale el código a tus compañeros de proyecto para poder unirse al grupo
              </div>
            }
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

  members = [
    {
      id: 1,
      name: 'Alicia Becker',
      imgSrc: 'assets/images/default-img.webp',
    },
    {
      id: 2,
      name: 'Juan Sideral Carrion',
      imgSrc: 'assets/images/default-img.webp',
    },
    {
      id: 3,
      name: 'Jose Carlos',
      imgSrc: 'assets/images/default-img.webp',
    }
  ] ;
}
