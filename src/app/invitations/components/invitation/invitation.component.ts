import {Component, Input} from '@angular/core';
import {Invitation} from '../../model/invitation.entity';

@Component({
  selector: 'app-invitation',
  imports: [],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.css'
})
export class InvitationComponent {
  @Input() invitation!: Invitation;

}
