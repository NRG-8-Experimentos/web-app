import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Invitation} from '../../model/invitation.entity';
import {DetailsService} from '../../../shared/services/details.service';

@Component({
  selector: 'app-invitation',
  imports: [],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.css'
})
export class InvitationComponent {
  constructor(
    private detailsService: DetailsService
  ) {
  }
  @Input() invitation!: Invitation;
  @Output() invitationChanged = new EventEmitter<void>();

  onAcceptRequest() {
    this.detailsService.acceptOrDeclineInvitation(this.invitation.id, true)
      .subscribe({
        next: () => { this.invitationChanged.emit(); },
        error: err => { /* mostrar error */ }
      });  }

  onRejectRequest() {
    this.detailsService.acceptOrDeclineInvitation(this.invitation.id, false)
      .subscribe({
        next: () => { this.invitationChanged.emit(); },
        error: err => { /* mostrar error */ }
      });  }
}
