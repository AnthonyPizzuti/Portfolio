import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LegalNoticeService {
    constructor(private translate: TranslateService) {}

    getLegalNotice(): string {
        return this.translate.instant('LEGAL_NOTICE.CONTENT');
      }
}
