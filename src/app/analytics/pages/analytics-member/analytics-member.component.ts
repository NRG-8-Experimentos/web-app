import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsService } from '../../../shared/services/details.service';
import { Member } from '../../../shared/model/member.entity';

@Component({
  selector: 'app-analytics-member',
  imports: [CommonModule],
  templateUrl: './analytics-member.component.html',
  styleUrl: './analytics-member.component.css'
})
export class AnalyticsMemberComponent {
  private detailsService = inject(DetailsService);
  member: Member | null = null;

  private getData() {
    this.detailsService.getMemberDetails().subscribe((response: Member) => {
      this.member = response;
      console.log('Member details fetched successfully:', this.member);
    }, error => {
      console.error('There was an error fetching member details!', error);
    });
  }

  ngOnInit(): void {
    this.getData();
  }
}
