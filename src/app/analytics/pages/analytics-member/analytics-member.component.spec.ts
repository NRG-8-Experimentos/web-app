import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsMemberComponent } from './analytics-member.component';

describe('AnalyticsMemberComponent', () => {
  let component: AnalyticsMemberComponent;
  let fixture: ComponentFixture<AnalyticsMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
