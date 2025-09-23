import { Component } from '@angular/core';
import {GroupDisplayComponent} from '../../components/group-display/group-display.component';

@Component({
  selector: 'app-my-group-leader',
  imports: [
    GroupDisplayComponent
  ],
  template: `
    <div class="h-full w-full">

      <app-group-display/>
    </div>
  `,
  styleUrl: './my-group-leader.component.css'
})
export class MyGroupLeaderComponent {

}
