import { Component } from '@angular/core';

@Component({
  selector: 'app-group-display',
  imports: [],
  template: `
    <div class="h-full">

      <div class="rounded-3xl max-w-2xl max-h-96 text-white font-bold text-2xl bg-[#1A4E85]">
         <div class="flex flex-col items-center justify-center p-20 space-y-4">
           <p>
             No haz creado tu grupo todavia
           </p>
           <div class="bg-[#4A90E2] rounded-2xl p-20">
             Crear Grupo
           </div>
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


}
