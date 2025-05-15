import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class PrivacyPolicyService {
  constructor(private translate: TranslateService) {}

  getPrivacyPolicy(): string {
    return this.translate.instant('PRIVACY_POLICY.CONTENT');
  }
}
