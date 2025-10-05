import {Component, Input} from '@angular/core';
import {Request} from '@app/requests/model/request.entity';
import {NgStyle} from '@angular/common';

@Component({
  selector: 'app-request-card',
  imports: [
    NgStyle
  ],
  templateUrl: './request-card.component.html',
  styleUrl: './request-card.component.css'
})
export class RequestCardComponent {
  @Input() request!: Request;

  setTypeColor(type?: string): string {
    switch (type) {
      case 'SUBMISSION':
        return '#4CAF50';
      case 'MODIFICATION':
        return '#FF832A';
      case 'EXPIRED':
        return '#F44336';
      default:
        return '#2196F3';
    }
  }

  getRequestTypeIcon(type?: string): string {
    switch (type) {
      case 'SUBMISSION':
        return 'check_circle';
      case 'MODIFICATION':
        return 'email';
      case 'EXPIRED':
        return 'warning';
      default:
        return 'info';
    }
  }

}
