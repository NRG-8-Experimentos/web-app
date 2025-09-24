import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CreateGroupRequest} from '@app/groups/model/requests/create-group.request';
import {GroupService} from '@app/groups/services/group.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-create-group',
  imports: [MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,],
  template: `
    <div class="w-full h-full">
      <h2 class="text-2xl font-bold">Crear Grupo</h2>
      <form [formGroup]="createGroupForm" (ngSubmit)="onSubmit()" class="container h-full p-10 flex flex-col ">
        <div class="flex flex-col">
          <mat-form-field appearance="fill" class="custom-form-field full-width">
            <mat-label>Nombre del Grupo</mat-label>
            <mat-icon matPrefix style="color: #888;">person</mat-icon>
            <input matInput formControlName="name" placeholder="Nombre Grupo" type="text" required>
            @if (createGroupForm.get('name')?.hasError){
              <mat-error >
                El usuario es <strong>requerido</strong>
              </mat-error>
            }
          </mat-form-field>
          <mat-form-field appearance="fill" class="custom-form-field full-width">
            <mat-label>Descipcion del grupo</mat-label>
            <mat-icon matPrefix style="color: #888;">group</mat-icon>
            <textarea matInput formControlName="description" placeholder="Descipcion Grupo" type="text" required rows="8" ></textarea>
            @if (createGroupForm.get('description')?.hasError){
              <mat-error >
                La descipcion es <strong>requerida</strong>
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="fill" class="custom-form-field full-width">
            <mat-label>Url de la imagen de grupo</mat-label>
            <mat-icon matPrefix style="color: #888;">link</mat-icon>
            <input matInput formControlName="imgUrl" placeholder="Url Imagen Grupo" type="text" required>
            @if (createGroupForm.get('imgUrl')?.hasError){
              <mat-error >
                El url de la imagen es <strong>requerida</strong>
              </mat-error>
            }
          </mat-form-field>
        </div>
        <div class="h-full flex justify-center items-center">
          <button
            [disabled]="createGroupForm.invalid"
            class="bg-[#4A90E2] rounded-2xl text-white text-xl py-2 px-6 shadow-md shadow-gray-400 hover:cursor-pointer hover:bg-[#559df2] transition disabled:bg-gray-400 disabled:cursor-default">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  `,
  styles: ``
})
export class CreateGroupComponent {
  createGroupForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private groupService : GroupService, private router: Router) {
    this.createGroupForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imgUrl: ['', Validators.required]
    });
  }

  onSubmit(): void {
    return;

    if (this.createGroupForm.invalid) return;

    const name = this.createGroupForm.value.name ?? '';
    const description = this.createGroupForm.value.description ?? '';
    const imgUrl = this.createGroupForm.value.imgUrl ?? '';


    this.groupService.createGroup(new CreateGroupRequest(name, description, imgUrl));
    this.submitted = true;
  }

}
