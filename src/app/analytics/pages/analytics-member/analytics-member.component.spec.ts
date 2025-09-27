import { AnalyticsMemberComponent } from './analytics-member.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../iam/services/auth.service';

describe('AnalyticsMemberComponent', () => {
  it('should create', () => {
    // Proporciona mocks mínimos para HttpClient y AuthService
    const httpMock = {} as HttpClient;
    const authServiceMock = {} as AuthService;
    const component = new AnalyticsMemberComponent();
    expect(component).toBeTruthy();
  });
});
