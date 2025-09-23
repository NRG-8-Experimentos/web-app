import { Component } from '@angular/core';

@Component({
  selector: 'app-group-display',
  imports: [],
  template: `
    <div class="h-full flex flex-col items-center justify-center ">

      <div class="rounded-3xl max-w-2xl max-h-96 text-white font-bold text-2xl bg-[#1A4E85] shadow-lg shadow-gray-400">
         <div class="flex flex-col items-center justify-between p-20 gap-16">
           <p>
             No haz creado tu grupo todavia
           </p>
           <button (click)="goToCreateGroupo()"
                   class="bg-[#4A90E2] rounded-2xl py-2 px-6 shadow-md shadow-gray-800 hover:cursor-pointer hover:bg-[#559df2] transition">
             Crear Grupo
           </button>
         </div>
      </div>
    </div>
  `,
  styles: ``
})
export class GroupDisplayComponent {
  groupName = "Los Backyardigans";
  groupCode = "345D76SF7";
  groupDescription = "\"Los Backyardigans\" es un equipo de trabajo cohesionado y multifuncional, especializado en soluciones logísticas, desarrollo de proyectos creativos y análisis de datos.";


  goToCreateGroupo() {
    console.log("crear grupo");
  }

}
